const express = require("express");

// import routes
const medicineRoutes = require("./routes/medicine");
const userRoutes = require("./routes/user");

const app = express();

// body parser
app.use(express.json());

// routes handling
app.use("/api/medicines", medicineRoutes);
app.use("/api/user", userRoutes);

// Not Found Route
app.use((req, res) => {
  console.log("this path is not available:", req.path);
  res.status(404).json({ message: "404 OOPS! PATH NOT FOUND" });
});

module.exports = app;
