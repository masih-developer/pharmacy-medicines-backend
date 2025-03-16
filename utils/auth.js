import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

import Env from "../config/Env.js";

const generateToken = (user, expiresIn, secret) => {
  return new Promise((reslove, reject) => {
    jwt.sign(
      { email: user.email },
      secret || Env.get("tokenSecretKey"),
      {
        expiresIn,
      },
      (error, token) => {
        if (error) {
          reject(createHttpError.InternalServerError("Internal Server Error!"));
        }
        reslove(token);
      },
    );
  });
};

const setAccessToken = async (res, user) => {
  const cookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 1, // would expire after 1 days
    httpOnly: true, // The cookie only accessible by the web server
    signed: true,
    sameSite: "Lax",
    secure: Env.get("nodeEnv") === "production",
    domain: Env.get("nodeEnv") === "development" ? "localhost" : undefined,
  };
  const token = await generateToken(
    user,
    "24h",
    Env.get("accessTokenSecretKey"),
  );
  res.cookie("accessToken", token, cookieOptions);
};

const setRefreshToken = async (res, user) => {
  const cookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 365, // would expire after 1 year
    httpOnly: true, // The cookie only accessible by the web server
    signed: true,
    sameSite: "Lax",
    secure: Env.get("nodeEnv") === "production",
    domain: Env.get("nodeEnv") === "development" ? "localhost" : undefined,
  };
  const token = await generateToken(
    user,
    "1y",
    Env.get("refreshTokenSecretKey"),
  );
  res.cookie("refreshToken", token, cookieOptions);
};

export { generateToken, setAccessToken, setRefreshToken };
