require("dotenv").config();

const express = require("express");
const connectToDB = require("./database/db");
const authRoutes = require("./routes/auth-routes");
const cors = require('cors');

const app = express();

app.use(cors({ 
    origin: 'http://localhost:5173', 
    credentials: true
 }))

const PORT = process.env.PORT || 4000;


connectToDB();

// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

app.get("/tesst-cors", (req, res) => {
  res.json({ message: "CORS is working!" });
});


app.listen(PORT, () => {
  console.log(`Server is now running on PORT ${PORT}`);
});
