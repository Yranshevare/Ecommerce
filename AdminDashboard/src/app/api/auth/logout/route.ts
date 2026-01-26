import response from "@/lib/response";
import { NextRequest } from "next/server";


export async function GET(req:NextRequest){
    try {
        const cooky = req.cookies.get("refreshToken")
        
        if(!cooky){
            return response({
                message:"user is not logged in",
                status:400
            })
        }

        const res = response({
            message:"user logged out successfully",
            status:200
        }) 

        res.cookies.delete("refreshToken")  // deleting the session created by login

        return res

    } catch (error:any) {
        return response({
            message:"error while decoding the refresh token",
            status:400,
            error:error.message
        })
    }
}