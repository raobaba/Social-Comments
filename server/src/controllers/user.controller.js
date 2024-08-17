const User = require("../models/user.model");
const asyncErrorHandler = require("./../middleware/asyncErrorHandler");
const sendToken = require("./../utils/sendToken");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

const uploadFile = asyncErrorHandler(async (req, res, next) => {
  if (!req.file) {
    const error = new ErrorHandler("No file uploaded", 400);
    return error.sendError(res);
  }

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "uploads",
    resource_type: "auto",
  });

  res.status(200).json({
    success: true,
    message: "File uploaded successfully",
    data: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });
});

// Register User
const registerUser = asyncErrorHandler(async (req, res, next) => {
  const { firstName, lastName, username, email, password } = req.body;
  console.log(req.body);
  // Ensure required fields are provided
  if (!firstName || !lastName || !username || !email || !password) {
    const error = new ErrorHandler("All fields are required", 400);
    return error.sendError(res);
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    const error = new ErrorHandler("User with this email already exists", 400);
    return error.sendError(res);
  }
  const myCloud = await cloudinary.uploader.upload(
    req.files.avatar.tempFilePath,
    {
      folder: "avatars",
      width: 150,
      crop: "scale",
    }
  );
  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  sendToken(user, 200, res);
});

// Login User
const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new ErrorHandler("Please Enter Email And Password", 400);
    return error.sendError(res);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new ErrorHandler("Invalid Email", 401);
    return error.sendError(res);
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    const error = new ErrorHandler("Incorrect Password", 401);
    return error.sendError(res);
  }

  sendToken(user, 201, res);
});

// Logout User
const logoutUser = asyncErrorHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "successfully Logged Out",
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  uploadFile,
};
