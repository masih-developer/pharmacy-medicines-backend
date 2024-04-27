const UserModel = require("../models/user.model");
const { registerSchema } = require("../validators/auth/index");
const Yup = require("yup");
const bcrypt = require("bcrypt");
const { setAccessToken, setRefreshToken } = require("../utils/auth");

const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } =
      await registerSchema.validate(req.body, { abortEarly: false });

    const isUserExist = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExist) {
      res.status(409).json({ message: "this user already registered" });
      return;
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
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      res.status(422).json({ message: error.errors[0] });
    }
  }
};

const loginUser = (req, res) => {
  res.json({ message: "user login successfully!" });
};

const getMeUser = (req, res) => {
  res.json({ message: "get user information successfully!" });
};

module.exports = { registerUser, loginUser, getMeUser };
