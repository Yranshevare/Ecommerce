import prisma from "@/lib/prisma";
import response from "@/lib/response";
import { supabaseServer } from "@/lib/supabaseServer";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const id = await req.nextUrl.searchParams.get("id");

        if (!id) {
            return response({ message: "id is missing", status: 400 });
        }
        const { data, error } = await supabaseServer.auth.admin.getUserById(id);
        if (error) {
            return response({ message: error.message, status: 400 });
        }

        const orders = await prisma.order.findMany({
            where: {
                userId: id,
            },
            select: {
                id: true,
                paymentMethod: true,
                totalPrice: true,
                createdAt: true,
                status: true,
            },
        });

        const res = {
            created_at: data.user.created_at,
            lastSignIn: data.user.last_sign_in_at,
            name: data.user.user_metadata.full_name || data.user.user_metadata.name,
            email: data.user.user_metadata.email,
            phone: data.user.user_metadata.phone,
            orders: orders,
        };

        return response({ message: "User fetched successfully", status: 200, data: res });
    } catch (error: any) {
        return response({ message: "error while decoding the refresh token", status: 400, error: error.message });
    }
}
