const mongoose = require("mongoose");
const app = require("./app");

const APP_PORT = process.env.PORT || 3000;

(async()=>{
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅Connected To Db Successfully :)");
    app.listen(APP_PORT, () => {
      console.log(`🚀Server Runnded on port ${APP_PORT}`);
    });
  } catch (error) {
    console.log(error);
    console.log("❌Connected To Db Failed :)");
    process.exit(1);
  }
})()