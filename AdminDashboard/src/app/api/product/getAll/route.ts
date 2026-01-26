import prisma from "@/lib/prisma"
import response from "@/lib/response"
import { NextRequest } from "next/server"

export async function GET(req:NextRequest){
    try {
        const products = await prisma.product.findMany({
            select:{
                id:true,
                name:true,
                images:true,
                category:true,
                description:true,
                price:true,
            }
        })

        const category = await prisma.category.findMany({
            select:{
                id:true,
                name:true
            }
        })

        return response({
            message:"products fetched successfully",
            status:200,
            data:{products, category}
        })
    } catch (error:any) {
        return response({message:"error while decoding the refresh token",status:400,error:error.message})
    }
}