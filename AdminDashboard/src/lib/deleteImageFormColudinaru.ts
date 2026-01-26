"use server"
import {v2 as cloudinary} from "cloudinary"
import { NextResponse } from "next/server"



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,      
    api_secret: process.env.CLOUDINARY_API_SECRETE  
  });


export async function deleteCloudinaryImage(imageUrl:any){
    console.log("deleteCloudinaryImage")
    try {
        // Extract the public ID from the image URL
        const urlArray = imageUrl.split('/')
        const imageName = urlArray[urlArray.length - 1]
        const image = imageName.split('.')[0]
        console.log(image)

        // Call Cloudinary's destroy method with the public ID
        const response = await cloudinary.uploader.destroy(image)

        console.log(response)

        // Check if the deletion was successful
        if (response.result !== 'ok') {
            throw new Error('Failed to delete image from Cloudinary')
        }
        
         // Return success response
         console.log(response)
        return NextResponse.json({
            message: "Image deleted successfully from cloudinary",
            status: 200
        })
    } catch (error:any) {
        console.log(error.message)
        return(
            NextResponse.json({
                error: error.message,
                message: "Error while deleting image from cloudinary",
                status: 500
            })
        )
    }

}