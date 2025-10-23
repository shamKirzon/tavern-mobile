import cloudinary from "../lib/cloudinary";

export const uploadImageWithUrl = async (localFile: any) => {
  try {
    const result = await cloudinary.uploader.upload(localFile.path, {
      resource_type: "image",
      public_id: localFile.originalname.split(".")[0],
    });

    return result.secure_url;
  } catch (error: any) {
    console.error("error from reservation service/uploadImage(): ", error);
    throw new Error("Failed to upload image");
  }
};
