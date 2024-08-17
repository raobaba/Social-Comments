const rateLimit = require('express-rate-limit');

const commentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 10, 
  message: "Too many comments created from this IP, please try again later.",
});

const replyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 10, 
  message: "Too many replies created from this IP, please try again later.",
});

module.exports = {
  commentLimiter,
  replyLimiter
};



