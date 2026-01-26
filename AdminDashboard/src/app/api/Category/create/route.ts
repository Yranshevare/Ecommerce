import { verifyRefreshToken } from "@/lib/handleToken";
import prisma from "@/lib/prisma"
import response from "@/lib/response"
import { NextRequest } from "next/server"

export async function POST(req:NextRequest) {
    try {
        if (!req.cookies.get("refreshToken")) {
            return response({message:"refresh token is missing", error: "unauthorize access", status: 400 });
        }

        if(!verifyRefreshToken(req.cookies.get("refreshToken")?.value as string)){    // for already logged in user
            return response({message:"unauthorize access",status:400})
        }
        const value = await req.json()

        if(!value?.name){        // for empty email or password
            return response({message:"name is missing",status:400})
        }

        const existing = await prisma.category.findFirst({
            where:{
                name:value.name
            }
        })
        if(existing){
            return response({message:"category already exists",status:400})
        }
        const category = await prisma.category.create({
            data:{
                name:value.name,
                description:value.description
            }
       })

        return response({
            message:"category created successfully",
            status:200,
            data:category
        })
    } catch (error:any) {
        return response({message:"error while decoding the refresh token",status:400,error:error.message})
    }
}