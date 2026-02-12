import cloudinary from '../config/cloudinary.js';
import { UploadApiResponse } from 'cloudinary';

export const uploadImage = async (
  file: string,
  folder: string = 'gramer-bazar'
): Promise<UploadApiResponse> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto',
    });
    return result;
  } catch (error) {
    throw new Error(`Image upload failed: ${error}`);
  }
};

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Image deletion failed: ${error}`);
  }
};

export const uploadMultipleImages = async (
  files: string[],
  folder: string = 'gramer-bazar'
): Promise<UploadApiResponse[]> => {
  try {
    const uploadPromises = files.map((file) => uploadImage(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(`Multiple image upload failed: ${error}`);
  }
};

export default {
  uploadImage,
  deleteImage,
  uploadMultipleImages,
};
