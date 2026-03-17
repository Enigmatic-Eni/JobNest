const express = require("express");
const router = express.Router();
const { runScraper } = require("../services/scraper");
const authMiddleware = require("../middleware/authmiddleware");

// Manual trigger for testing
// Protected by auth so random people can't abuse it
router.post("/trigger", authMiddleware, async (req, res) => {
  try {
    // Send response immediately, scraper runs in background
    res.status(200).json({ message: "Scraper started" });
    runScraper();
  } catch (err) {
    res.status(500).json({ message: "Scraper failed to start" });
  }
});

module.exports = router;