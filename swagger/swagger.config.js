const swaggerJSDoc = require("swagger-jsdoc");
require('dotenv').config();

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Procurement Management API",
      version: "1.0.0",
      description: "API documentation for Procurement Management System",
    },
    servers: [
      {
        url: process.env.BASE_URL+ "/api",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  // Paths to files containing OpenAPI definitions
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
