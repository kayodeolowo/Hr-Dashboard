import { Request, Response } from "express";
import cloudinary from "../configs/cloudinaryConfig";
import { sendSuccessResponse } from "../utils/sendSuccessResponse";

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {


    // Ensure a file exists in the request
    if (!req.file) {
      throw new Error("No file uploaded.");
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",
    });

      sendSuccessResponse(res, "Image uploaded successfully", {
      imageUrl: result.secure_url,
    });
  } catch (error: any) {
    console.error("Upload error:", error);

    res.status(error.message === "No file uploaded." ? 400 : 500).json({
      success: false,
      message: error.message || "Image upload failed.",
    });
  }
};

