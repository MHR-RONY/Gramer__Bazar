import { v2 as cloudinary } from 'cloudinary';
import config from './index.js';

export const configureCloudinary = (): void => {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });

  console.log('✅ Cloudinary Configured');
};

export default cloudinary;
