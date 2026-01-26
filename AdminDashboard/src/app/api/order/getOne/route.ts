import prisma from "@/lib/prisma";
import response from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("id");

        if (!id) {
            return response({ message: "Order id not found", status: 400 });
        }

        // 1️⃣ Fetch order
        const order = await prisma.order.findUnique({
            where: { id },
        });

        if (!order) {
            return response({ message: "Order not found", status: 404 });
        }

        // 2️⃣ Extract product IDs
        const productIds = order.products.map((p) => p.productId);

        // 3️⃣ Fetch product data
        const products = await prisma.product.findMany({
            where: {
                id: { in: productIds },
            },
            select: {
                id: true,
                name: true,
                images: true,
                specification: true,
            },
        });

        // 4️⃣ Merge order items with product data
        const formattedProducts = order.products.map((item) => {
            const product = products.find((p) => p.id === item.productId);

            return {
                productId: item.productId,
                quantity: item.quantity ?? 1,
                price: item.price,
                product: {
                    name: product?.name || "Unknown Product",
                    images: product?.images || [],
                    specification: product?.specification || {},
                },
            };
        });

        // 5️⃣ Final formatted response (STRICTLY matches type)
        const formattedOrder = {
            id: order.id,
            status: order.status,
            paymentMethod: order.paymentMethod,
            totalPrice: order.totalPrice,
            createdAt: order.createdAt.toISOString(),
            address: order.address,
            city: order.city,
            state: order.state,
            pin: order.pin,
            phone: order.phone,
            products: formattedProducts,
            email: order.email,
            fullName: order.fullName,
        };

        return response({
            message: "Order fetched successfully",
            status: 200,
            data: formattedOrder,
        });
    } catch (error) {
        console.error("Order fetch error:", error);
        return response({
            message: "Internal server error",
            status: 500,
        });
    }
}
