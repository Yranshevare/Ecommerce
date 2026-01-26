import prisma from "@/lib/prisma";
import response from "@/lib/response";
import { supabaseServer } from "@/lib/supabaseServer";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const token = await req.nextUrl.searchParams.get("token");

        if (!token) {
            console.log("No token provided in Authorization header");
            return response({ message: "Unauthorized, token not found", status: 401 });
        }

        // console.log(token);

        const {
            data: { user },
            error,
        } = await supabaseServer.auth.getUser(token);

        if (error || !user) {
            console.log("Supabase Auth Error:", error);
            return response({ message: "Unauthorized, user not found", status: 401 });
        }

        const order = await prisma.order.findMany({
            where: {
                userId: user.id,
            },
        });

        if (!order) {
            return response({ message: "Order Not Found", status: 404 });
        }

        const orderWithProducts = await Promise.all(
            order.map(async (ord) => {
                const products = await ord.products.map(async (product) => {
                    const productData = await prisma.product.findUnique({
                        where: {
                            id: product.productId,
                        },
                        select: {
                            images: true,
                            specification: true,
                            name: true,
                        }
                    });
                    return {
                        ...product,
                        productData,
                    };
                });
                return {
                    ...ord,
                    products: await Promise.all(products),
                };
            })
        );

        return response({ message: "Order Fetched Successfully", status: 200, data: orderWithProducts  });
    } catch (error: any) {
        console.log(error);
        return response({ message: "Internal Server Error", status: 500, error: error.message });
    }
}
