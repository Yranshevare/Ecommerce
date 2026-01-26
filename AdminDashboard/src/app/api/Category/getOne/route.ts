import prisma from "@/lib/prisma";
import response from "@/lib/response";
import { NextRequest } from "next/server";


export async function GET(req:NextRequest) {
    try {
        const {searchParams} = new URL(req.url) 

        const id = searchParams.get("id")

        if(!id){        // for empty email or password
            return response({message:"id is missing",status:400})
        }

        const category = await prisma.category.findUnique({
            where:{
                id:id
            },
            include:{
                product:true
            }
        })

        const otherProducts = await prisma.product.findMany({
            where:{
                OR:[
                    {
                        category:{
                            isSet:false
                        }
                    },
                    {
                        category:{
                            not:category?.name
                        }
                    }
                ]
            }
        })

        return response({
            message:"category fetched successfully",
            status:200,
            data:{category,otherProducts}
        })
    } catch (error) {
        
    }
}