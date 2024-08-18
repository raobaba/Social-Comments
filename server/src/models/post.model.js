const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  commentCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updatedAt` before saving
postSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update commentCount before saving
postSchema.pre('save', async function(next) {
  if (this.isModified('comments')) {
    // Update commentCount
    this.commentCount = this.comments.length;
  }
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
