require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDB = require('./database/db');
const authRoute = require('./routes/authRoute');

const app = express();
app.use(express.json())
app.use(cors())
app.use('/auth', authRoute)

connectToDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});



// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
// app.use(express.json());

// // CORS test route
// app.get('/test-cors', (req, res) => {
//   res.json({ message: 'CORS is working!' });
// });

// app.use('/auth', authRoute);

// // connect to DB (AFTER route definitions to avoid issues on DB fail)
// connectToDB();

// app.listen(PORT, () => {
//   console.log(`Server is now running on port ${PORT}`);
// });
