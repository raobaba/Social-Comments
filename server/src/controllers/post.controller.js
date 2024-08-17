const Post = require("../models/post.model");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary").v2;

// Create a new post
const createPost = asyncErrorHandler(async (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    const error = new ErrorHandler("Title and content are required", 400);
    return error.sendError(res);
  }

  let image = {};
  if (req.files && req.files.image) {
    const myCloud = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        folder: "images",
        width: 150,
        crop: "scale",
      }
    );
    image = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const post = await Post.create({
    title,
    content,
    userId: req.user._id,
    image,
  });

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: post,
  });
});

// Get a single post by ID
const getPostById = asyncErrorHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId).populate("userId", "username");

  if (!post) {
    const error = new ErrorHandler("Post not found", 404);
    return error.sendError(res);
  }

  res.status(200).json({
    success: true,
    data: post,
  });
});

// Get all posts with pagination
const getAllPosts = asyncErrorHandler(async (req, res, next) => {
  const { page = 1, pageSize = 10 } = req.query;

  const posts = await Post.find()
    .skip((page - 1) * pageSize)
    .limit(parseInt(pageSize))
    .populate("userId", "username");

  const totalPosts = await Post.countDocuments();

  res.status(200).json({
    success: true,
    data: posts,
    totalPosts,
    totalPages: Math.ceil(totalPosts / pageSize),
    currentPage: parseInt(page),
  });
});

// Update a post
const updatePost = asyncErrorHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  const post = await Post.findById(postId);

  if (!post) {
    const error = new ErrorHandler("Post not found", 404);
    return error.sendError(res);
  }

  if (post.userId.toString() !== req.user._id.toString()) {
    const error = new ErrorHandler(
      "You are not authorized to update this post",
      403
    );
    return error.sendError(res);
  }

  if (req.files && req.files.image) {
    await cloudinary.uploader.destroy(post.image.public_id);
    const myCloud = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        folder: "images",
        width: 150,
        crop: "scale",
      }
    );
    post.image = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  post.title = title || post.title;
  post.content = content || post.content;

  await post.save();

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    data: post,
  });
});

// Delete a post
const deletePost = asyncErrorHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    const error = new ErrorHandler("Post not found", 404);
    return error.sendError(res);
  }

  if (post.userId.toString() !== req.user._id.toString()) {
    const error = new ErrorHandler(
      "You are not authorized to delete this post",
      403
    );
    return error.sendError(res);
  }

  if (post.image.public_id) {
    await cloudinary.uploader.destroy(post.image.public_id);
  }

  await post.remove();

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});

module.exports = {
  createPost,
  getPostById,
  getAllPosts,
  updatePost,
  deletePost,
};
