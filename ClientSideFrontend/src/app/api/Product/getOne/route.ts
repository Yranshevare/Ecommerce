import prisma from "@/lib/prisma"
import response from "@/lib/response"
import { NextRequest } from "next/server"

export async function GET(req:NextRequest){
    try {

        const id = await req.nextUrl.searchParams.get("id")

        if(!id){        // for empty email or password
            return response({message:"id is missing",status:400})
        }
        const products = await prisma.product.findUnique({
            where:{
                id:id
            },
            
        })

        return response({
            message:"products fetched successfully",
            status:200,
            data:{products}
        })
    } catch (error:any) {
        return response({message:"error while decoding the refresh token",status:400,error:error.message})
    }
}