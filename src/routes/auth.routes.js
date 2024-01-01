const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { encryptPassword, verifyPassword } = require("../utils");

const router = express.Router();

router.post("/register", async (request, response) => {
  const { email, password } = request.body;
  try {
    const encryptedPassword = await encryptPassword(password);
    const user = await User.create({
      email,
      password: encryptedPassword,
    });
    return response.json(user);
  } catch (error) {
    if (error.code === 11000) {
      return response.status(422).json({
        message: "Email already exists",
      });
    }
    return response.status(500).json({
      message: "Internal error",
    });
  }
});

router.post("/auth", async (request, response) => {
  const { email, password } = request.body;
  try {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return response.status(404).json({
        message: "User not found",
      });
    }
    const isCorrectPassword = await verifyPassword(password, user.password);
    if (!isCorrectPassword) {
      return response.status(404).json({
        message: "Incorrect password",
      });
    }
    const payload = {
      id: user.id,
      email: user.email,
      active: user.active,
      createdAt: user.createdAt,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return response.json({ token });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: "Internal error",
    });
  }
});

module.exports = router;
