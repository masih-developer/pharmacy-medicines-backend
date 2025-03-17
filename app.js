import cookieParser from "cookie-parser";
import cors from "cors";
import express, { json } from "express";
import createHttpError from "http-errors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import Env from "./config/Env.js";
import medicineRoutes from "./routes/medicine.js";
import userRoutes from "./routes/user.js";

const app = express();

// CORS settings
app.use(
  cors({
    origin: Env.get("allowCorsOrigin").split("|"),
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

// Body parser
app.use(json());
app.use(cookieParser(Env.get("cookieParserSecretKey")));

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pharmacy Medicine Api",
      version: "1.0.0",
      description: "api documentation for pharmacy app",
    },
    components: {
      securitySchemes: {
        auth: {
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
    externalDocs: {
      url: "http://localhost:5000/swagger.json",
      description: "http://localhost:5000/swagger.json",
    },
    tags: [
      { name: "Medicine", description: "Everything about Medicines" },
      {
        name: "User",
        description: "Everything about Users",
      },
    ],
    servers: [
      { url: "https://production.com", description: "production" },
      { url: "https://mock.com", description: "mock" },
    ],
  },
  apis: ["./routes/*.js"],
});

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {}));
app.get("/swagger.json", (req, res) => res.json(swaggerSpec));

app.use("/api/medicines", medicineRoutes);
app.use("/api/user", userRoutes);

app.use((req, res, next) => {
  next(createHttpError.NotFound("The requested address was not found."));
});

app.use((error, req, res) => {
  console.error(error);

  let statusCode;
  let message;

  if (error.name === "ValidationError") {
    statusCode = 422;
    message = error.errors[0];
  } else {
    const serverError = createHttpError.InternalServerError();
    statusCode = error.status || serverError.status;
    message = error.message || serverError.message;
  }

  res.status(statusCode).json({ statusCode, message });
});

export default app;
