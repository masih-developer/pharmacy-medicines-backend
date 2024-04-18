const express = require("express");

const app = express();

const server = app.listen(3000, () => {
  console.log(`Server Runnded on port ${server.address().port}`);
});

app.get("/", (req, res) => {
  res.send("hello from app backend");
});
