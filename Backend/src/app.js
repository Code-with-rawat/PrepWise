const express = require('express');
const authRoutes = require('./Routes/auth.route.js');
const interviewRoutes = require('./Routes/interview.route.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
//  Use auth routes for all /api/auth endpoints 
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes); // Use interview routes for all /api/interview endpoints

module.exports = app;