const cloudinary = require("../config/cloudinary");

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  try {
    console.log("🗑️ Deleting from Cloudinary:", publicId);

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
      invalidate: true
    });

    if (result.result !== "ok") {
      console.warn("⚠️ Cloudinary delete result:", result);
    }

  } catch (error) {
    console.error("❌ Cloudinary delete failed:", error.message);
  }
};

module.exports = deleteFromCloudinary;
