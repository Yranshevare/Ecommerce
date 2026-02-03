import prisma from "@/lib/prisma";
import response from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const product = await prisma.product.findMany({
            orderBy: {
                createdAt: "desc", // 👈 newest first
            },
            omit: {
                createdAt: true,
                updatedAt: true,
            },
        });
        return response({ message: "Product Fetched Successfully", status: 200, data: product });
    } catch (error) {
        return response({ message: "Internal Server Error", status: 500 });
    }
}
