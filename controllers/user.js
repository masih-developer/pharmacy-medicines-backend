import { hash } from "bcrypt";
import createHttpError from "http-errors";

import { verifyRefreshToken } from "../middleware/auth.js";
import UserModel from "../models/user.js";
import { setAccessToken, setRefreshToken } from "../utils/auth.js";
import { loginSchema, registerSchema } from "../validators/auth/index.js";

const registerUser = async (req, res) => {
  const { firstname, lastname, username, email, password } =
    await registerSchema.validate(req.body, { abortEarly: false });

  const isUserExist = await UserModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExist) {
    throw createHttpError.Conflict("this user already registered");
  }

  const hashedPass = await hash(password, 12);

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
      "user not found, email or password is incorrect!",
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

const getUserProfile = async (req, res) => {
  const { _id: id } = req.user;
  const user = await UserModel.findById(id);
  res.json(user);
};

export { getMeUser, getRefreshToken, getUserProfile, loginUser, registerUser };
