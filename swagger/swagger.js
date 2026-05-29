const dotenv = require('dotenv');
dotenv.config();
const swaggerJSDoc = require('swagger-jsdoc');
const port = process.env.PORT || 3000;
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Office Management System API',
      version: '1.0.0',
      description: 'Office Management System API swagger implementation',
    },
    servers: [
      {
        url: process.env.SWAGGER_SERVER_URL || `http://localhost:${port}`,
        description:
          process.env.NODE_ENV === 'production'
            ? 'Production Server'
            : 'Local Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
    },
    tags: [
      {
        name: 'User Login/Register',
        description: 'User management and authentication',
      },
    ],
  },
  apis: ['./routes/*.js', './swagger/schemas/*.js'],
};

module.exports = swaggerJSDoc(options);
