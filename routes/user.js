const express = require("express");
const { loginUser, registerUser, getMeUser } = require("../controllers/user");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", getMeUser);

module.exports = router;
