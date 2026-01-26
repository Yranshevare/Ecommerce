import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRETE,
});

const uploadOnCloudinary = async (file: File): Promise<string | null> => {
  try {
    if (!file) return null;

    // Convert File → Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert to base64 Data URI
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary (await works here)
    const result = await cloudinary.uploader.upload(base64, {
      resource_type: "auto",
    });

    return result.url ; // only return URL
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return null;
  }
};

export { uploadOnCloudinary };