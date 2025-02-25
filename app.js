const express = require("express");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const cors = require("cors");

// import routes
const medicineRoutes = require("./routes/medicine");
const userRoutes = require("./routes/user");

const app = express();

app.use(
  cors({
    origin: process.env.ALLOW_CORS_ORIGIN.split("|"),
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// body parser
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY));

// routes handling
app.use("/api/medicines", medicineRoutes);
app.use("/api/user", userRoutes);

// Not Found Route
app.use((req, res, next) => {
  next(createError.NotFound("آدرس مورد نظر یافت نشد."));
});

app.use((error, req, res, next) => {
  console.error(error);

  let statusCode;
  let message;

  if (error.name === "ValidationError") {
    statusCode = 422;
    message = error.errors[0];
  } else {
    const serverError = createError.InternalServerError();
    statusCode = error.status || serverError.status;
    message = error.message || serverError.message;
  }

  res.status(statusCode).json({
    statusCode,
    message,
  });
});

module.exports = app;
