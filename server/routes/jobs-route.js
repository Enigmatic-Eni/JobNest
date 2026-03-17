const express = require('express')
const router = express.Router();
const { getJobs, getJobById } = require("../controller/jobs-controller");
const authMiddleware = require("../middleware/authmiddleware");

// Get all jobs (with search and filters)
router.get("/", authMiddleware, getJobs);

// Get single job by ID
router.get("/:id", authMiddleware, getJobById);

module.exports = router;