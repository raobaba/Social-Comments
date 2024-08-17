const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Multi-Level Comment System by The Alter Office',
      version: '1.0.0',
      description: 'API documentation for the Multi-Level Comment System',
    },
    servers: [
      { url: 'http://localhost:8000' },
      { url: 'https://digitalpaani-book-management.onrender.com' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      { bearerAuth: [] },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const openapiSpecification = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  openapiSpecification
};
