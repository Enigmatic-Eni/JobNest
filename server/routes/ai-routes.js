const express = require("express");
const router = express.Router();
const { generateCV, generateCoverLetterDoc, getGeneratedDocs } = require("../controller/aiController");
const authMiddleware = require("../middleware/authmiddleware");

// Generate tailored CV for a specific job
router.post("/generate-cv/:jobId", authMiddleware, generateCV);

// Generate cover letter for a specific job
router.post("/generate-cover-letter/:jobId", authMiddleware, generateCoverLetterDoc);

// Get previously generated docs for a specific job
// Called when user opens job detail page
router.get("/generated-docs/:jobId", authMiddleware, getGeneratedDocs);

module.exports = router;