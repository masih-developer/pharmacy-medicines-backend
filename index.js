import { connect } from "mongoose";

import app from "./app.js";
import Env from "./config/Env.js";

const APP_PORT = Env.get("port") || 3000;

(async () => {
  try {
    await connect(Env.get("mongodbUri"));
    console.log("✅Connected To Db Successfully :)");
    app.listen(APP_PORT, "0.0.0.0", () => {
      console.log(`🚀Server Runnded on port ${APP_PORT}`);
    });
  } catch (error) {
    console.log(error);
    console.log("❌Connected To Db Failed :)");
    process.exit(1);
  }
})();
