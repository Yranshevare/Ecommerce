import prisma from "@/lib/prisma"
import response from "@/lib/response"
import { NextRequest } from "next/server"

export async function GET(req:NextRequest){
    try {
        const category = await prisma.category.findMany({
            select:{
                name:true
            }
        })
        // console.log(category)

        return response({
            message:"category fetched successfully",
            status:200,
            data:category
        })
    } catch (error:any) {
        return response({message:"error while decoding the refresh token",status:400,error:error.message})
    }
}