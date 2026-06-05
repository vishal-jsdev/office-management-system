const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const port = process.env.PORT || 3000;
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const { ApiError, errorHandler } = require('./utils/APIError');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger'); // path to your swagger-jsdoc file
const basicAuth = require('express-basic-auth');
const Auth = require('./routes/auth.route');
const Employee = require('./routes/employee.route');
const Department = require('./routes/department.route');
const Attendance = require('./routes/attendance.route');
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
const swaggerAuth =
  process.env.NODE_ENV === 'production'
    ? basicAuth({
        authorizer: (username, password) => {
          return (
            basicAuth.safeCompare(username, process.env.SWAGGER_USERNAME) &&
            basicAuth.safeCompare(password, process.env.SWAGGER_PASSWORD)
          );
        },
        challenge: true,
      })
    : (req, res, next) => next();

// Define routes
app.use('/auth', Auth);
app.use('/employee', Employee);
app.use('/department', Department);
app.use('/attendance', Attendance);
// swagger route
app.use(
  '/api-docs',
  swaggerAuth,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true, // this caches the token
    },
  })
);
// Global error handler middleware
app.use(errorHandler);
app.listen(port, (error) => {
  error ? console.log(error) : console.log(`server started on: ${port}`);
});