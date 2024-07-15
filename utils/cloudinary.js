const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require('dotenv').config();


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary as storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'flight_tickets', // Cloudinary folder where you want to store images
    allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed image formats
    transformation: [{ width: 200, height: 300, crop: 'limit' }] // Optional: resizing images
  }
});

module.exports = { cloudinary, storage };
