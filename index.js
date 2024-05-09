require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const APP_PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅Connected To Db Successfully :)");
    app.listen(APP_PORT, () => {
      console.log(`🚀Server Runnded on port ${APP_PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
    console.log("❌Connected To Db Failed :)");
  });
