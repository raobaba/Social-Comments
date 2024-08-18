const mongoose = require('mongoose');

// Define the schema for comments
const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    public_id: {
      type: String,
      default: null, // Allow image field to be optional
    },
    url: {
      type: String,
      default: null, // Allow image field to be optional
    },
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to populate replies with the most recent two replies before executing the find query
commentSchema.pre('find', function(next) {
  this.populate({
    path: 'replies',
    options: {
      sort: { createdAt: -1 }, // Sort replies by creation date in descending order
      limit: 2, // Limit to two recent replies
    },
    populate: {
      path: 'userId', // Populate user information for each reply
      select: 'username',
    },
  });
  next();
});

// Middleware to populate replies with the most recent two replies before executing the findOne query
commentSchema.pre('findOne', function(next) {
  this.populate({
    path: 'replies',
    options: {
      sort: { createdAt: -1 }, // Sort replies by creation date in descending order
      limit: 2, // Limit to two recent replies
    },
    populate: {
      path: 'userId', // Populate user information for each reply
      select: 'username',
    },
  });
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
