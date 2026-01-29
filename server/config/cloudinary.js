const cloudinary = require("cloudinary").v2; // ← Make sure .v2 is here!

console.log("☁️ Configuring Cloudinary...");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log("✓ Cloudinary configured:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✓" : "✗ MISSING!",
  api_key: process.env.CLOUDINARY_API_KEY ? "✓" : "✗ MISSING!",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "✗ MISSING!" : "✓"
});

module.exports = cloudinary;
