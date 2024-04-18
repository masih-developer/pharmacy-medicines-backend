const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.get("/", (req, res) => {
  res.send("hello from app backend");
});

mongoose
  .connect("mongodb://127.0.0.1/pharmacy-medicines")
  .then(() => {
    console.log("✅Connected To Db Successfully :)");
    const server = app.listen(3000, () => {
      console.log(`🚀Server Runnded on port ${server.address().port}`);
    });
  })
  .catch(() => {
    console.log("❌Connected To Db Failed :)");
  });
