import { signedCookie } from "cookie-parser";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

import UserModel from "../models/user.js";

const { Unauthorized, NotFound } = createHttpError;

function verifyAccessToken(req, res, next) {
  try {
    const accessToken = req.signedCookies.accessToken;
    if (!accessToken) {
      throw Unauthorized("لطفا وارد حساب کاربری خود شوید.");
    }
    const token = signedCookie(
      accessToken,
      process.env.COOKIE_PARSER_SECRET_KEY,
    );
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET_KEY,
      async (err, payload) => {
        try {
          if (err) throw Unauthorized("توکن نامعتبر است");
          const { email } = payload;
          const user = await UserModel.findOne({ email });
          if (!user) throw Unauthorized("حساب کاربری یافت نشد");
          req.user = user;
          return next();
        } catch (error) {
          next(error);
        }
      },
    );
  } catch (error) {
    next(error);
  }
}

function verifyRefreshToken(req) {
  const refreshToken = req.signedCookies.refreshToken;
  if (!refreshToken) {
    throw Unauthorized("لطفا وارد حساب کاربری خود شوید.");
  }
  const token = signedCookie(
    refreshToken,
    process.env.COOKIE_PARSER_SECRET_KEY,
  );
  return new Promise((resolve, reject) => {
    verify(
      token,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      async (err, payload) => {
        try {
          if (err) reject(Unauthorized("لطفا وارد حساب کاربری خود شوید."));
          const { email } = payload;
          const user = await UserModel.findOne({ email });
          if (!user) reject(Unauthorized("حساب کاربری یافت نشد."));
          return resolve(user);
        } catch {
          reject(NotFound("حساب کاربری یافت نشد."));
        }
      },
    );
  });
}

function decideAuthMiddleware(req, res, next) {
  const accessToken = req.signedCookies.accessToken;
  if (accessToken) {
    return verifyAccessToken(req, res, next);
  }
  // skip this middleware
  next();
}

export { decideAuthMiddleware, verifyAccessToken, verifyRefreshToken };
