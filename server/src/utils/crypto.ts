import crypto from "crypto";

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.CRYPTO_SECRET_KEY!.padEnd(32)),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return iv.toString("base64") + ":" + encrypted;
};

export const decrypt = (encryptedText: string): string => {
  const [ivBase64, encryptedBase64] = encryptedText.split(":");

  if (!ivBase64 || !encryptedBase64) {
    throw new Error("Invalid encrypted data format");
  }

  const iv = Buffer.from(ivBase64, "base64");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.CRYPTO_SECRET_KEY!.padEnd(32)),
    iv
  );

  let decrypted = decipher.update(encryptedBase64, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
