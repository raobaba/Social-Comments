const Comment = require("../models/comment.model");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");

// Create Comment
const createComment = asyncErrorHandler(async (req, res, next) => {
  const { text, image } = req.body;
  const { postId } = req.params;

  if (!postId || !text) {
    const error = new ErrorHandler("Post ID and comment text are required", 400);
    return error.sendError(res);
  }

  const comment = await Comment.create({
    postId,
    userId: req.user._id,
    text,
    image, // Include image field if provided
  });

  res.status(201).json({
    success: true,
    message: "Comment created successfully",
    data: comment,
  });
});

// Reply to Comment
const replyToComment = asyncErrorHandler(async (req, res, next) => {
  const { text, image } = req.body;
  const { postId, commentId } = req.params;

  if (!postId || !commentId || !text) {
    const error = new ErrorHandler("Post ID, comment ID, and reply text are required", 400);
    return error.sendError(res);
  }

  // Create a new reply
  const reply = await Comment.create({
    postId,
    userId: req.user._id,
    text,
    parentCommentId: commentId,
    image, // Include image field if provided
  });

  // Update the parent comment to include the new reply
  await Comment.findByIdAndUpdate(
    commentId,
    { $push: { replies: reply._id } },
    { new: true }
  );

  res.status(201).json({
    success: true,
    message: "Reply created successfully",
    data: reply,
  });
});

// Get Comments for a Post
const getCommentsForPost = asyncErrorHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { sortBy = "createdAt", sortOrder = "asc" } = req.query;

  if (!postId) {
    const error = new ErrorHandler("Post ID is required", 400);
    return error.sendError(res);
  }

  const comments = await Comment.find({ postId, parentCommentId: null })
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .populate({
      path: "replies",
      options: { 
        sort: { createdAt: -1 }, // Sort replies by creation date in descending order
        limit: 2, // Limit to two recent replies
      },
      populate: {
        path: "userId",
        select: "username",
      },
    });

  res.status(200).json({
    success: true,
    data: comments,
  });
});

// Expand Parent-Level Comments with Pagination
const expandParentComments = asyncErrorHandler(async (req, res, next) => {
  const { postId, commentId } = req.params;
  const { page = 1, pageSize = 10 } = req.query;

  if (!postId || !commentId) {
    const error = new ErrorHandler("Post ID and comment ID are required", 400);
    return error.sendError(res);
  }

  const comments = await Comment.find({ postId, parentCommentId: commentId })
    .skip((page - 1) * pageSize)
    .limit(parseInt(pageSize))
    .populate({
      path: "replies",
      options: { 
        sort: { createdAt: -1 }, 
        limit: 2, 
      },
      populate: {
        path: "userId",
        select: "username",
      },
    });

  res.status(200).json({
    success: true,
    data: comments,
  });
});

// Edit Comment
const editComment = asyncErrorHandler(async (req, res, next) => {
  const { postId, commentId } = req.params;
  const { text, image } = req.body;

  // Find the comment belonging to the specific post
  const comment = await Comment.findOne({ _id: commentId, postId });
  if (!comment) {
    const error = new ErrorHandler("Comment not found or does not belong to the specified post", 404);
    return error.sendError(res);
  }

  // Check if the user is the author of the comment
  if (comment.userId.toString() !== req.user._id.toString()) {
    const error = new ErrorHandler("You can only edit your own comments", 403);
    return error.sendError(res);
  }

  // Update the comment
  comment.text = text || comment.text;
  comment.image = image || comment.image; // Update image if provided
  await comment.save();

  res.status(200).json({
    success: true,
    message: "Comment updated successfully",
    data: comment,
  });
});

// Delete Comment
const deleteComment = asyncErrorHandler(async (req, res, next) => {
  const { postId, commentId } = req.params;

  // Find the comment belonging to the specific post
  const comment = await Comment.findOne({ _id: commentId, postId });
  if (!comment) {
    const error = new ErrorHandler("Comment not found or does not belong to the specified post", 404);
    return error.sendError(res);
  }

  // Check if the user is the author of the comment
  if (comment.userId.toString() !== req.user._id.toString()) {
    const error = new ErrorHandler("You can only delete your own comments", 403);
    return error.sendError(res);
  }

  // Remove the comment from its parent comments' replies
  if (comment.parentCommentId) {
    await Comment.findByIdAndUpdate(
      comment.parentCommentId,
      { $pull: { replies: commentId } }
    );
  }

  // Delete the comment
  await comment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});

// Edit Reply
const editReply = asyncErrorHandler(async (req, res, next) => {
  const { postId, commentId, replyId } = req.params;
  const { text, image } = req.body;

  // Find the comment belonging to the specific post
  const comment = await Comment.findOne({ _id: commentId, postId });
  if (!comment) {
    const error = new ErrorHandler("Comment not found or does not belong to the specified post", 404);
    return error.sendError(res);
  }

  // Find the reply within the comment
  const reply = await Comment.findOne({ _id: replyId, parentCommentId: commentId });
  if (!reply) {
    const error = new ErrorHandler("Reply not found", 404);
    return error.sendError(res);
  }

  // Check if the user is the author of the reply
  if (reply.userId.toString() !== req.user._id.toString()) {
    const error = new ErrorHandler("You can only edit your own replies", 403);
    return error.sendError(res);
  }

  // Update the reply
  reply.text = text || reply.text;
  reply.image = image || reply.image; // Update image if provided
  await reply.save();

  res.status(200).json({
    success: true,
    message: "Reply updated successfully",
    data: reply,
  });
});

// Delete Reply
const deleteReply = asyncErrorHandler(async (req, res, next) => {
  const { postId, commentId, replyId } = req.params;

  // Find the comment belonging to the specific post
  const comment = await Comment.findOne({ _id: commentId, postId });
  if (!comment) {
    const error = new ErrorHandler("Comment not found or does not belong to the specified post", 404);
    return error.sendError(res);
  }

  // Find the reply within the comment
  const reply = await Comment.findOne({ _id: replyId, parentCommentId: commentId });
  if (!reply) {
    const error = new ErrorHandler("Reply not found", 404);
    return error.sendError(res);
  }

  // Check if the user is the author of the reply
  if (reply.userId.toString() !== req.user._id.toString()) {
    const error = new ErrorHandler("You can only delete your own replies", 403);
    return error.sendError(res);
  }

  // Remove the reply from the parent comment's replies
  comment.replies.pull(replyId);
  await comment.save();

  // Delete the reply
  await reply.deleteOne();

  res.status(200).json({
    success: true,
    message: "Reply deleted successfully",
  });
});

module.exports = {
  createComment,
  replyToComment,
  getCommentsForPost,
  expandParentComments,
  editComment,
  deleteComment,
  editReply,
  deleteReply,
};
