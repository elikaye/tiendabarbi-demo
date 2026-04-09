import pkg from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const { v2: cloudinary } = pkg; // 👈 usamos v2 (correcto)

const { 
  CLOUDINARY_CLOUD_NAME, 
  CLOUDINARY_API_KEY, 
  CLOUDINARY_API_SECRET 
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export default cloudinary;