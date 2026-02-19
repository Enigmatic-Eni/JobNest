require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/db");
const authRoute = require("./routes/auth-routes")
const cors = require('cors');
const path = require('path')
const profileRoutes = require("./routes/profile-route");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://job-nest-seven.vercel.app'
  ],
  credentials: true
}));



connectToDB();

// Middleware
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use('/auth', authRoute )
app.use("/uploads", express.static("uploads"));
app.use("/profile", profileRoutes) ;


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

app.listen(PORT, () => {
  console.log(`Server is now running on PORT ${PORT}`);
});
