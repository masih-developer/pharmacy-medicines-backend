import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import {
  getMeUser,
  getRefreshToken,
  getUserProfile,
  loginUser,
  registerUser,
} from "../controllers/user.js";
import { verifyAccessToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", expressAsyncHandler(registerUser));

router.post("/login", expressAsyncHandler(loginUser));

router.get("/me", expressAsyncHandler(getMeUser));

router.get("/refresh", expressAsyncHandler(getRefreshToken));

router.get("/profile", verifyAccessToken, expressAsyncHandler(getUserProfile));

export default router;
