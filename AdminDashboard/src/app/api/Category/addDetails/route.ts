import prisma from "@/lib/prisma";
import response from "@/lib/response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        if (!req.cookies.get("refreshToken")) {
            return response({ message: "refresh token is missing", error: "unauthorize access", status: 400 });
        }
        const { details, id }: any = await req.json();

        if(!id) {
            return response({ message: "id is missing", status: 400 });
        }

        if(details === "<p></p>"){
            return response({ message: "details are missing", status: 400 });
        }

        const updatedCategory = await prisma.category.update({
            where: {
                id: id
            },
            data: {
                details: details
            }
        })

        return response({ message: "category details updated successfully", status: 200, data: updatedCategory });
    } catch (error) {
        return response({ message: "error while decoding the refresh token", status: 400 });
    }
}
