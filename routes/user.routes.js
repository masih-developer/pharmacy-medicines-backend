const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const {
  loginUser,
  registerUser,
  getMeUser,
  getRefreshToken,
  getUserProfile,
} = require("../controllers/user.controller");
const { verifyAccessToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", expressAsyncHandler(registerUser));

router.post("/login", expressAsyncHandler(loginUser));

router.get("/me", expressAsyncHandler(getMeUser));

router.get("/refresh", expressAsyncHandler(getRefreshToken));

router.get("/profile", verifyAccessToken, expressAsyncHandler(getUserProfile));

module.exports = router;
