import response from "@/lib/response";
import { supabaseServer } from "@/lib/supabaseServer";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { data, error } = await supabaseServer.auth.admin.listUsers();
        if (error) {
            return response({ message: error.message, status: 400 });
        }

        const res = {
            userCount : data.total,
            users: data.users.map((user) => ({
                id: user.id,
                email:user.email,
                name:user.user_metadata.full_name || user.user_metadata.name,
                Phone:user.user_metadata.phone
            }))
        }   

        return response({ message: "User fetched successfully", status: 200, data: res });
    } catch (error: any) {
        return response({ message: "error while decoding the refresh token", status: 400, error: error.message });
    }
}
