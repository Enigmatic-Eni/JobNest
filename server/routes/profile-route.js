const express = require("express");
const router = express.Router();

// Import controllers
const { 
  getProfile, 
  updateProfile, 
  uploadDocument,
  getDocumentUrl,  // NEW: Get fresh signed URL
  deleteDocument 
} = require("../controller/profile-controller");

// Import middlewares
const authMiddleware = require("../middleware/authmiddleware");
const upload = require("../middleware/upload");

// Get profile
router.get("/", authMiddleware, getProfile);

// Update profile
router.put("/", authMiddleware, updateProfile);

// Upload document
router.post(
  "/upload",
  authMiddleware,
  upload.single("document"),
  uploadDocument
);

// NEW: Get fresh signed URL for viewing document
router.get("/document/:documentType/url", authMiddleware, getDocumentUrl);

// Delete document
router.delete("/document/:documentType", authMiddleware, deleteDocument);

module.exports = router;