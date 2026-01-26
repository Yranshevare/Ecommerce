import prisma from "@/lib/prisma";
import response from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest){ 
    try {
        if(!req.cookies.get("refreshToken")){    // for already logged in user
            return response({message:"unauthorize access",status:400})
        }
        const order = await prisma.order.findMany()
        return response({message:"Notification fetched successfully",status:200,data:order})
    } catch (error:any) {
        console.log(error.message)
        return response({message:"error while decoding the refresh token",status:400,error:error.message})
    }
    
}