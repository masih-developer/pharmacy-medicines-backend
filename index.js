require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const APP_PORT = process.env.PORT || 3000;

mongoose
  .connect("mongodb://127.0.0.1/pharmacy-medicines")
  .then(() => {
    console.log("✅Connected To Db Successfully :)");
    app.listen(APP_PORT, () => {
      console.log(`🚀Server Runnded on port ${APP_PORT}`);
    });
  })
  .catch(() => {
    console.log("❌Connected To Db Failed :)");
  });
