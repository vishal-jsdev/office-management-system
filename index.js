const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const port = process.env.PORT || 3000;
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const { ApiError, errorHandler } = require('./utils/APIError');

const User = require('./routes/user.route');
connectDB();
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use('/user', User);
// Global error handler middleware
app.use(errorHandler);
app.listen(port, (error) => {
  error ? console.log(error) : console.log(`server started on: ${port}`);
});