import prisma from "@/lib/prisma";
import response from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest){
    try {
        const {searchParams} = new URL(req.url)         // http://localhost:3000/api/product/search?search=abc

        const searchTerm = searchParams.get("search")

        if(!searchTerm || searchTerm === ""){        // for empty email or password
            return response({message:"search is missing",status:400})
        }

        const products = await prisma.product.findMany({
          where: {
            OR: [
              { productName: { contains: searchTerm, mode: "insensitive" } },
              { category: { contains: searchTerm, mode: "insensitive" } },
              { description: { contains: searchTerm, mode: "insensitive" } },
              { price: { contains: searchTerm, mode: "insensitive" } },
              { material: { contains: searchTerm, mode: "insensitive" } },
              { size: { contains: searchTerm, mode: "insensitive" } },
              { weight: { contains: searchTerm, mode: "insensitive" } },
              { otherSpecification: { contains: searchTerm, mode: "insensitive" } },
            ],
          },
        });

        return response({
            message:"products fetched successfully",
            status:200,
            data:products
        })
    } catch (error:any) {
        return response({message:"error while decoding the refresh token",status:400,error:error.message})
    }
}