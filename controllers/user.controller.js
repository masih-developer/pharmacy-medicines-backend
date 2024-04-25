const cookieParser = require("cookie-parser");
const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const verifyAccessToken = async (req, res, next) => {
  try {
    const accessToken = req.signedCookies["accessToken"];
    if (!accessToken) {
      throw createHttpError.Unauthorized("لطفا وارد حساب کاربری خود شوید.");
    }
    const token = cookieParser.signedCookie(
      accessToken,
      process.env.COOKIE_PARSER_SECRET_KEY
    );
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET_KEY,
      async (err, payload) => {
        try {
          if (err) throw createHttpError.Unauthorized("توکن نامعتبر است");
          const { email } = payload;
          const user = await UserModel.findOne(email);
          if (!user) throw createHttpError.Unauthorized("حساب کاربری یافت نشد");
          req.user = user;
          return next();
        } catch (error) {
          next(error);
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

const decideAuthMiddleware = (req, res, next) => {
  const accessToken = req.signedCookies["accessToken"];
  if (accessToken) {
    return verifyAccessToken(req, res, next);
  }
  // skip this middleware
  next();
};

module.exports = {
  verifyAccessToken,
  decideAuthMiddleware,
  isVerifiedUser,
};
