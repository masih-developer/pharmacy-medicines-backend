const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const {
  loginUser,
  registerUser,
  getMeUser,
  getRefreshToken,
} = require("../controllers/user.controller");

const router = express.Router();

router.post("/register", expressAsyncHandler(registerUser));

router.post("/login", expressAsyncHandler(loginUser));

router.get("/me", expressAsyncHandler(getMeUser));

router.get("/refresh", expressAsyncHandler(getRefreshToken));

module.exports = router;
