import swaggerJSDoc, { type Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { type Express } from "express";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HRM API",
      version: "1.0.0",
      description: "API documentation for HRM",
      contact: {
        name: "Developer",
      },
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./src/controller/*.ts"], // Adjust the path to match your project structure
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
