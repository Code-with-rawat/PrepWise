const express = require('express');
const authRoutes = require('./Routes/auth.route.js');
const interviewRoutes = require('./Routes/interview.route.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://gray-coast-0e6d38800.5.azurestaticapps.net"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

//Use for Testing the Backend

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend deploy successfully",
    environment: process.env.NODE_ENV
  });
});

app.use(express.json());
app.use(cookieParser());
//  Use auth routes for all /api/auth endpoints 
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes); // Use interview routes for all /api/interview endpoints

module.exports = app;