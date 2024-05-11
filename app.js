const express = require("express");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const cors = require("cors");
// import routes
const medicineRoutes = require("./routes/medicine.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://pharmacy-medicines-frontend.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PUT, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// app.use(
//   cors({
//     credentials: true,
//     // origin: process.env.ALLOW_CORS_ORIGIN.split("|"),
//     origin: ["http://localhost:5173"],
//     // optionsSuccessStatus: 200,
//   })
// );

// app.use(cors({ credentials: true }));

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
