import {getCloudinary} from "../config/cloudinary.js";

export const uploadToCloudinary = (fileBuffer, folder) => {
  const cloudinary = getCloudinary();
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
  {
    folder,
    resource_type: "image",
    format: "pdf",
    access_mode: "public",   // 👈 REQUIRED
    delivery_type: "upload"  // 👈 REQUIRED
  },

        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(fileBuffer);
  });
};
