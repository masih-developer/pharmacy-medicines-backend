const UserModel = require("../models/user.model");
const { registerSchema, loginSchema } = require("../validators/auth/index");
const bcrypt = require("bcrypt");
const createHttpError = require("http-errors");
const { setAccessToken, setRefreshToken } = require("../utils/auth");
const { verifyRefreshToken } = require("../middleware/auth.middleware");

const registerUser = async (req, res) => {
  const { firstname, lastname, username, email, password } =
    await registerSchema.validate(req.body, { abortEarly: false });

  const isUserExist = await UserModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExist) {
    throw createHttpError.Conflict("this user already registered");
  }

  const hashedPass = await bcrypt.hash(password, 12);

  const user = await UserModel.create({
    firstname,
    lastname,
    username,
    email,
    password: hashedPass,
  });

  await setAccessToken(res, user);
  await setRefreshToken(res, user);

  res.json(user);
};

const loginUser = async (req, res) => {
  const { email } = await loginSchema.validate(req.body);
  const user = await UserModel.findOne({ email });
  if (!user)
    throw createHttpError.NotFound(
      "user not found, email or password is incorrect!"
    );
  await setAccessToken(res, user);
  await setRefreshToken(res, user);
  res.json({ user, message: "ورود با موفقیت انجام شد." });
};

const getMeUser = (req, res) => {
  res.json({ message: "get user information successfully!" });
};

const getRefreshToken = async (req, res) => {
  const user = await verifyRefreshToken(req);
  await setAccessToken(res, user);
  await setRefreshToken(res, user);
  return res.status(200).json({
    StatusCode: 200,
    user,
  });
};

module.exports = { registerUser, loginUser, getMeUser, getRefreshToken };
