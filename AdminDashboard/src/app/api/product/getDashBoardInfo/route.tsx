import prisma from "@/lib/prisma"
import response from "@/lib/response"
import { NextRequest } from "next/server"

export async function GET(req:NextRequest) {
    try {

        console.log("into get dashboard info")
        const recentProduct = await prisma.product.findMany({take:4,orderBy:{updatedAt:"desc"}})
        const productCount = await prisma.product.count()
        const categoryCount = await prisma.category.count()
        const orderCount = await prisma.order.count({where:{status:"PENDING"}})


        return response({
            message:"category fetched successfully",
            status:200,
            data:{recentProduct,count:[productCount,categoryCount, orderCount]}
        })
    } catch (error:any) {
        return response({message:"error while decoding the refresh token",status:400,error:error.message})
    }
}