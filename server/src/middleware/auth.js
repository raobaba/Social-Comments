const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const asyncErrorHandler = require("./asyncErrorHandler");

const isAuthenticatedUser = asyncErrorHandler(async (req, res, next) => {
  const token = req.header("Authorization");
  // console.log("authentication token", token);
  if (!token) {
    return res.status(401).json({ error: "Authorization token missing" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = user;
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
  next();
});

module.exports = isAuthenticatedUser;
