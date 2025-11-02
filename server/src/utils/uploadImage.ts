import cloudinary from "../lib/cloudinary";

export const uploadImageWithUrl = async (localFile: any, type: string) => {
  try {
    const result = await cloudinary.uploader.upload(localFile.path, {
      folder: type === "validId" ? "tav_valid_id" : "tav_payment",
      resource_type: "image",
      public_id: localFile.originalname.split(".")[0],
    });

    return result.secure_url;
  } catch (error: any) {
    console.error("error from reservation service/uploadImage(): ", error);
    throw new Error("Failed to upload image");
  }
};
