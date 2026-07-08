const express = require('express');
const authRoutes = require('./Routes/auth.route.js');
const interviewRoutes = require('./Routes/interview.route.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://prepwise-ai-zjlx.onrender.com",
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

app.use(express.json());
app.use(cookieParser());
//  Use auth routes for all /api/auth endpoints 
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes); // Use interview routes for all /api/interview endpoints

module.exports = app;