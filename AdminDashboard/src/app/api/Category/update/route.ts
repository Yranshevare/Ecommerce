import { verifyRefreshToken } from "@/lib/handleToken";
import prisma from "@/lib/prisma";
import response from "@/lib/response";
import { NextRequest } from "next/server";

export async function POST (req:NextRequest){
    try {
        if (!req.cookies.get("refreshToken")) {
            return response({message:"refresh token is missing", error: "unauthorize access", status: 400 });
        }

        if(!verifyRefreshToken(req.cookies.get("refreshToken")?.value as string)){    // for already logged in user
            return response({message:"unauthorize access",status:400})
        }

        const data = await req.json()
        // console.log(data)
        const category = await prisma.category.update({
            where: {
                id: data.id
            },
            data: {
              categoryName: data.formData.name,
              description: data.formData.description
            }
        })
        // console.log(category)

        return response({message:"category updated successfully",status:200, data:category})
    } catch (error) {
        return response({message:"error while decoding the refresh token",status:400})
    }
}