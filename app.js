import cookieParser from "cookie-parser";
import cors from "cors";
import express, { json } from "express";
import createHttpError from "http-errors";

// import routes
import medicineRoutes from "./routes/medicine.js";
import userRoutes from "./routes/user.js";

const app = express();

app.use(
  cors({
    origin: process.env.ALLOW_CORS_ORIGIN.split("|"),
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

// body parser
app.use(json());
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY));

// routes handling
app.use("/api/medicines", medicineRoutes);
app.use("/api/user", userRoutes);

// Not Found Route
app.use((req, res, next) => {
  next(createHttpError.NotFound("آدرس مورد نظر یافت نشد."));
});

app.use((error, req, res, next) => {
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

  res.status(statusCode).json({
    statusCode,
    message,
  });
});

export default app;
