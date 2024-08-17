const express = require("express");
const router = express.Router();

const userRoutes = require("./user.route");
const postRoutes = require("./post.route");
const commentRoutes = require("./comment.route");

router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/posts", commentRoutes);

module.exports = router;
