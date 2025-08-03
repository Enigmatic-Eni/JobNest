require("dotenv").config();

const express = require("express");
const connectToDB = require("./database/db");

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



app.get("/test-cors", (req, res) => {
  res.json({ message: "CORS is working! Lmao" });
});


app.listen(PORT, () => {
  console.log(`Server is now running on PORT ${PORT}`);
});
