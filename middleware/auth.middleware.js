const jwt = require("jsonwebtoken");

const checkJwtToken = (req, res, next) => {
  const token = req.cookies.token;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("token");
  }
};
