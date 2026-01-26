import {generateRefreshToken } from "@/lib/handleToken";
import { NextRequest } from "next/server";
import response from "@/lib/response";

export async function GET(req:NextRequest){
    try {           
        const {searchParams} = new URL(req.url)         // http://localhost:3000/api/auth/login?email=abc@gmail.com&password=abc123

        const email = searchParams.get("email")
        const password = searchParams.get("password")

        if(!email || !password){        // for empty email or password
            return response({
                message:"email or password is missing",
                status:400
            })
        }

        if(email !== process.env.ADMIN_EMAIL){  // for invalid email
            return response({
                message:"invalid email",
                status:400
            })
        }

        if(password !== process.env.ADMIN_PASSWORD){    // for invalid password
            return response({
                message:"invalid password",
                status:400
            })
        }


        if(req.cookies.get("refreshToken")){    // for already logged in user
            
            return response({
                message:"user is already logged in",
                status:200
            })
        }


        const refreshToken = generateRefreshToken({email})      // creating the refresh token   

        const res =  response({
            message:"login request success",
            status:200
        })


        res.cookies.set("refreshToken",refreshToken,{httpOnly:true,secure:true}) // setting up the cookies to create the session

        return res
        
    } catch (error:any) {
        return response({
            message:"something went wrong",
            error: error.message,
            status:500
        })
    }
}