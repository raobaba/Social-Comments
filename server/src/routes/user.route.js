const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  uploadFile,
} = require("../controllers/user.controller.js");

const userRouter = express.Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").get(logoutUser);
userRouter.route("/avatar").post(uploadFile);

module.exports = userRouter;
