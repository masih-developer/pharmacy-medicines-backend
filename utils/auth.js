const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const setAccessToken = async (res, user) => {
  const cookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 1, // would expire after 1 days
    httpOnly: true, // The cookie only accessible by the web server
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "development" ? false : true,
    domain:
      process.env.NODE_ENV === "development"
        ? "localhost"
        : ".pharmacydomain.ir",
  };
  await res.cookie(
    "accessToken",
    await generateToken(user, "24h", process.env.ACCESS_TOKEN_SECRET_KEY),
    cookieOptions
  );
};

const setRefreshToken = async (res, user) => {
  const cookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 365, // would expire after 1 year
    httpOnly: true, // The cookie only accessible by the web server
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "development" ? false : true,
    domain:
      process.env.NODE_ENV === "development"
        ? "localhost"
        : ".pharmacydomain.ir",
  };
  res.cookie(
    "refreshToken",
    await generateToken(user, "1y", process.env.REFRESH_TOKEN_SECRET_KEY),
    cookieOptions
  );
};

const generateToken = (user, expiresIn, secret) => {
  return new Promise((reslove, reject) => {
    jwt.sign(
      { email: user.email },
      secret || process.env.TOKEN_SECRET_KEY,
      {
        expiresIn,
      },
      (error, token) => {
        if (error) {
          reject(createError.InternalServerError("Internal Server Error!"));
        }
        reslove(token);
      }
    );
  });
};

function verifyRefreshToken(req) {
  const refreshToken = req.signedCookies["refreshToken"];
  if (!refreshToken) {
    throw createError.Unauthorized("لطفا وارد حساب کاربری خود شوید.");
  }
  const token = cookieParser.signedCookie(
    refreshToken,
    process.env.COOKIE_PARSER_SECRET_KEY
  );
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      async (err, payload) => {
        try {
          if (err)
            reject(createError.Unauthorized("لطفا وارد حساب کاربری خود شوید."));
          const { _id } = payload;
          const user = await UserModel.findById(_id, {
            password: 0,
            otp: 0,
            resetLink: 0,
          });
          if (!user) reject(createError.Unauthorized("حساب کاربری یافت نشد."));
          return resolve(_id);
        } catch (error) {
          reject(createError.Unauthorized("حساب کاربری یافت نشد."));
        }
      }
    );
  });
}

module.exports = {
  setAccessToken,
  setRefreshToken,
  verifyRefreshToken,
  generateToken,
};
