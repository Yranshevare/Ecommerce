import { verifyRefreshToken } from "@/lib/handleToken";
import prisma from "@/lib/prisma";
import response from "@/lib/response";
import { uploadOnCloudinary } from "@/lib/uploadImageToCloudinary";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // --- Auth check ---
        const token = req.cookies.get("refreshToken")?.value;
        if (!token) {
            return response({ error: "unauthorize access", status: 400 });
        }
        if (!verifyRefreshToken(token)) {
            return response({ message: "unauthorize access", status: 400 });
        }

        // --- Parse FormData ---
        const formData = await req.formData();

        const name = formData.get("name") as string;
        const category = formData.get("category") as string;
        const description = formData.get("description") as string;
        const price = formData.get("price") as string;
        const discount = formData.get("discount") as string | null;
        const specification: any = formData.get("specification");
        const imageFiles = formData.getAll("images") as File[];

        const img: string[] = [];

        const uploadPromises = imageFiles.map((file) => uploadOnCloudinary(file));

        const results = await Promise.all(uploadPromises);

        for (const uploaded of results) {
            if (uploaded) img.push(uploaded);
        }

        // const product = {
        //   name: name,
        // //   images: img,
        //   category: category || null,
        //   description: description,
        //   price: price,
        //   discount: discount || undefined,
        //   specification: JSON.parse(specification),
        // }

        // --- Save to DB ---
        const product = await prisma.product.create({
            data: {
                name: name,
                images: img,
                category: category || null,
                description,
                price,
                discount: discount || undefined,
                specification: JSON.parse(specification),
            },
        });

        return response({
            message: "product added successfully",
            status: 200,
            data: product,
        });
    } catch (error: any) {
        console.log(error.message);
        return response({
            message: "error while adding the product",
            status: 400,
            error: error.message,
        });
    }
}
