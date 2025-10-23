import cloudinary from "../lib/cloudinary";

export const uploadImageWithUrl = async (imageUri: string) => {
  try {
    const result = await cloudinary.uploader.upload(imageUri, {
      resource_type: "image",
    });

    return result.secure_url;
  } catch (error: any) {
    console.error("error from reservation service/uploadImage(): ", error);
    throw new error("cloudinary upload failed");
  }
};

// next part is: test it in frontend :
