import prisma from "@/lib/prisma";
import response from "@/lib/response";
import { supabaseServer } from "@/lib/supabaseServer";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const token = await req.nextUrl.searchParams.get("token");

        if (!token) {
            console.log("No token provided in Authorization header");
            return response({ message: "Unauthorized, token not found", status: 401 });
        }

        console.log(token);

        const {
            data: { user },
            error,
        } = await supabaseServer.auth.getUser(token);

        if (error || !user) {
            console.log("Supabase Auth Error:", error);
            return response({ message: "Unauthorized, user not found", status: 401 });
        }

        try {
            const order = await prisma.order.create({
                data: {
                    ...data,
                    userId: user.id,
                },
            });

            return response({ message: "Order Placed Successfully", status: 200, data: order });
        } catch (error: any) {
            console.log(error);
            return response({ message: "Internal Server Error", error: error.message, status: 500 });
        }
    } catch (error) {
        return response({ message: "Internal Server Error", status: 500 });
    }
}
