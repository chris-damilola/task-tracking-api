import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Internal Task Tracking API",
      version: "1.0.0",
      description:
        "API documentation for the Internal Task and Ticket Tracking System with Gemini AI assistance.",
    },

    servers: [
      {
        url: "/",
        description: "API server",
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
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
