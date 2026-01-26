import prisma from "@/lib/prisma";
import response from "@/lib/response";
import { NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    try {
        if (!req.cookies.get("refreshToken")) {
            return response({message:"refresh token is missing", error: "unauthorize access", status: 400 });
        }
        const {products,category}:any =await  req.json()
        // console.log(products,category)

        const NewProducts = await prisma.product.updateMany({
            where: {
                id: {
                    in: products
                }
            },
            data: {
                category: category
            }
        })

        const updatedCategory = await prisma.category.update({
            where: {
                name: category
            },
            data: {
              product: {
                connect: products.map((id: string) => ({ id }))
              }
            }
        })

        return response({message:"category created successfully",status:200})
        
    } catch (error:any) {
        return response({message:"error while decoding the refresh token",status:400, error:error.message})
    }
}