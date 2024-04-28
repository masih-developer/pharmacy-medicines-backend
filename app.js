const express = require("express");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");

// import routes
const medicineRoutes = require("./routes/medicine.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

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
  const serverError = createError.InternalServerError();
  const statusCode =
    error.name === "ValidationError" ? 422 : error.status || serverError.status;
  const message = error.message || serverError.message;
  return res.status(statusCode).json({
    statusCode,
    message,
  });
});

module.exports = app;
