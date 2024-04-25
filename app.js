const express = require("express");
const cookieParser = require("cookie-parser");

// import routes
const medicineRoutes = require("./routes/medicine.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

// body parser
app.use(express.json());
app.use(cookieParser());

// routes handling
app.use("/api/medicines", medicineRoutes);
app.use("/api/user", userRoutes);

// Not Found Route
app.use((req, res) => {
  console.log("this path is not available:", req.path);
  res.status(404).json({ message: "404 OOPS! PATH NOT FOUND" });
});

module.exports = app;
