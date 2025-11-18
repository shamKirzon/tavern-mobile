import QRCode from "qrcode";
import { encrypt } from "./crypto";
import cloudinary from "../lib/cloudinary";
import fs from "fs";

type QRData = {
  reservationId: string;
  orderId: string;
};

export const generateQR = async (data: QRData, email: string) => {
  try {
    const jsonData = JSON.stringify(data);
    const encrypted = encrypt(jsonData);
    const filePath = `./reservation-order-qr.png`;

    await QRCode.toFile(filePath, jsonData, {
      errorCorrectionLevel: "M",
      width: 400,
    });

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "tav_qr",
      resource_type: "image",
      public_id: `${email.split("@")[0]!}-qr`,
    });

    fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (error) {
    console.error("Failed to genearate QR", error);
  }
};
