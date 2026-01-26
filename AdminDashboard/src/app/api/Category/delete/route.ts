import { verifyRefreshToken } from "@/lib/handleToken";
import prisma from "@/lib/prisma";
import response from "@/lib/response";
import { NextRequest } from "next/server";

export async function  DELETE(req:NextRequest){
    try {
        if(!req.cookies.get("refreshToken")){    // for already logged in user
            return response({error:"unauthorize access",status:400})
        }
        if(!verifyRefreshToken(req.cookies.get("refreshToken")?.value as string)){    // for already logged in user
            return response({message:"unauthorize access",status:400})
        }

        const {searchParams} = new URL(req.url)         // http://localhost:3000/api/auth/login?email=abc@gmail.com&password=abc123

        const id = searchParams.get("id")
        // console.log(id)

        if(!id){        // for empty email or password
            return response({message:"id is missing",status:400})
        }

        const category = await prisma.category.delete({where:{id:id}})
        // console.log(category)

        return response({message:"category deleted successfully",status:200, data:category})
    } catch (error) {
        return response({message:"error while decoding the refresh token",status:400})
    }
}