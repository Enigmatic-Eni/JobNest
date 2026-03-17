require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");

const connectToDB = require("./database/db");
const authRoute = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-route");
const scraperRoute = require("./routes/scraper-route");
const { runScraper } = require("./services/scraper");
const jobsRoute = require("./routes/jobs-route");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------- CORS ----------------------
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://job-nest-seven.vercel.app"
  ],
  credentials: true
}));

// ---------------------- MIDDLEWARE ----------------------
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------------- DATABASE ----------------------
connectToDB();

// ---------------------- ROUTES ----------------------
app.use("/auth", authRoute);
app.use("/profile", profileRoutes);
app.use("/scraper", scraperRoute);
app.use("/jobs", jobsRoute);

// ---------------------- SCRAPER ----------------------
// Runs once immediately when server starts
runScraper();

// Runs every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Running scheduled scraper...");
  runScraper();
});

// ---------------------- ERROR HANDLER ----------------------
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File too large. Maximum size is 5MB"
    });
  }

  console.error("\n🚨 UNHANDLED ERROR 🚨");
  console.error("Error:", err);
  console.error("Stack:", err.stack);
  console.error("==================\n");

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message
  });
});

// ---------------------- START SERVER ----------------------
app.listen(PORT, () => {
  console.log(`Server is now running on PORT ${PORT}`);
});