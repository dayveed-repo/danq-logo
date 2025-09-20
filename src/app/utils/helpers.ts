import * as CryptoJS from "crypto-js";

export const blobToBase64 = async (imageBlob: any) => {
  const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());

  if (!imageBlob?.type || !imageBlob.type.includes("image")) return "";

  let imageBase64 =
    "data:" + imageBlob.type + ";base64," + imageBuffer.toString("base64");

  return imageBase64;
};

let encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "";

export const encrypt = (plainText: string) => {
  const cipherText = CryptoJS.AES.encrypt(plainText, encryptionKey).toString();
  return cipherText;
};

export const decrypt = (cipherText: string) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, encryptionKey);
  const plainText = bytes.toString(CryptoJS.enc.Utf8);
  return plainText;
};
