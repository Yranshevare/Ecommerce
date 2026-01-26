import { deleteCloudinaryImage } from "@/lib/deleteImageFormColudinaru";
import { verifyRefreshToken } from "@/lib/handleToken";
import prisma from "@/lib/prisma";
import response from "@/lib/response";
import { NextRequest } from "next/server";

export async function DELETE(req:NextRequest) {
    try {
        const {searchParams} = new URL(req.url)         // http://localhost:3000/api/product/remove?id=123

        const id = searchParams.get("id")

        if(!id){        // for empty email or password
            return response({message:"id is missing",status:400})
        }

        if(!req.cookies.get("refreshToken")){    // for already logged in user
            return response({error:"unauthorize access",status:400})
        }

        if(!verifyRefreshToken(req.cookies.get("refreshToken")?.value as string)){    // for already logged in user
            return response({message:"unauthorize access",status:400})
        }

        const product = await prisma.product.findUnique({
            where:{
                id:id
            }
        })

        if(!product){        // for empty email or password
            return response({message:"product not found",status:400})
        }
        if(product.images.length !== 0){
            await Promise.all(
              product.images.map(image => deleteCloudinaryImage(image))
            );
        }

        const deletedProduct = await prisma.product.delete({
            where:{
                id:id
            }
        })

        return response({
            message:"product removed successfully",
            status:200,
            data:deletedProduct
        })
    } catch (error:any) {
        return response({message:"error while decoding the refresh token",status:400,error:error.message})
    }
}