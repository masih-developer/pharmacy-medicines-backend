const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const {
  loginUser,
  registerUser,
  getMeUser,
} = require("../controllers/user.controller");

const router = express.Router();

router.post("/register", expressAsyncHandler(registerUser));

router.post("/login", expressAsyncHandler(loginUser));

router.get("/me", expressAsyncHandler(getMeUser));

module.exports = router;
