const express = require("express");
const router = express.Router();
const {
  createComment,
  replyToComment,
  getCommentsForPost,
  expandParentComments,
  editComment,
  deleteComment,
  editReply,
  deleteReply,
} = require("../controllers/comment.controller");
const isAuthenticatedUser = require("../middleware/auth");

// Rate Limiting Middlewares
const {
  commentLimiter,
  replyLimiter,
} = require("../middleware/rateLimitMiddleware");

router
  .route("/:postId/comments")
  .post(isAuthenticatedUser, commentLimiter, createComment);
 // Swagger documentation for Create Comment
  /**
 * @swagger
 * /api/v1/posts/{postId}/comments:
 *   post:
 *     summary: Create a new comment on a post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post where the comment will be created
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text content of the comment
 *                 example: "This is a comment"
 *             required:
 *               - text
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Comment created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "6143c68f5e3e3f2b68d72b43"
 *                     text:
 *                       type: string
 *                       example: "This is a comment"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-08-17T12:00:00Z"
 *                     postId:
 *                       type: string
 *                       example: "6143c68f5e3e3f2b68d72b42"
 *       400:
 *         description: Bad Request - Possibly due to missing or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid request data"
 *       401:
 *         description: Unauthorized - User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access"
 *       500:
 *         description: Internal Server Error - Something went wrong on the server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred on the server"
 */


router
  .route("/:postId/comments/:commentId/reply")
  .post(isAuthenticatedUser, replyLimiter, replyToComment);

  /**
 * @swagger
 * /api/v1/posts/{postId}/comments/{commentId}/reply:
 *   post:
 *     summary: Reply to an existing comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post where the comment is located
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment to which the reply will be added
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text content of the reply
 *                 example: "This is a reply"
 *             required:
 *               - text
 *     responses:
 *       201:
 *         description: Reply created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Reply created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "6143c68f5e3e3f2b68d72b44"
 *                     text:
 *                       type: string
 *                       example: "This is a reply"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-08-17T12:15:00Z"
 *                     postId:
 *                       type: string
 *                       example: "6143c68f5e3e3f2b68d72b42"
 *                     parentCommentId:
 *                       type: string
 *                       example: "6143c68f5e3e3f2b68d72b43"
 *       400:
 *         description: Bad Request - Possibly due to missing or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid request data"
 *       401:
 *         description: Unauthorized - User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access"
 *       500:
 *         description: Internal Server Error - Something went wrong on the server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred on the server"
 */


router
  .route("/:postId/comments")
  .get(isAuthenticatedUser, getCommentsForPost);

  /**
 * @swagger
 * /api/v1/posts/{postId}/comments:
 *   get:
 *     summary: Get comments for a post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post for which comments are to be retrieved
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: 'createdAt'
 *         required: false
 *         description: Field to sort comments by (e.g., 'createdAt', 'updatedAt')
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           default: 'asc'
 *         required: false
 *         description: Order of sorting ('asc' for ascending, 'desc' for descending)
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "6143c68f5e3e3f2b68d72b43"
 *                       text:
 *                         type: string
 *                         example: "This is a comment"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-08-17T12:00:00Z"
 *                       postId:
 *                         type: string
 *                         example: "6143c68f5e3e3f2b68d72b42"
 *                       replies:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "6143c68f5e3e3f2b68d72b44"
 *                             text:
 *                               type: string
 *                               example: "This is a reply"
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               example: "2024-08-17T12:15:00Z"
 *                       totalReplies:
 *                         type: number
 *                         example: 1
 *       400:
 *         description: Bad Request - Possibly due to invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid query parameters"
 *       401:
 *         description: Unauthorized - User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access"
 *       500:
 *         description: Internal Server Error - Something went wrong on the server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred on the server"
 */


router
  .route("/:postId/comments/:commentId/expand")
  .get(isAuthenticatedUser, expandParentComments);

  /**
 * @swagger
 * /api/v1/posts/{postId}/comments/{commentId}/expand:
 *   get:
 *     summary: Expand parent-level comments with pagination
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post for which comments are to be expanded
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the parent comment whose replies are to be expanded
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of replies per page
 *     responses:
 *       200:
 *         description: Comments expanded successfully with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "6143c68f5e3e3f2b68d72b44"
 *                       text:
 *                         type: string
 *                         example: "This is a reply"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-08-17T12:15:00Z"
 *                       postId:
 *                         type: string
 *                         example: "6143c68f5e3e3f2b68d72b42"
 *                       parentCommentId:
 *                         type: string
 *                         example: "6143c68f5e3e3f2b68d72b43"
 *                       replies:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "6143c68f5e3e3f2b68d72b45"
 *                             text:
 *                               type: string
 *                               example: "This is a reply to a reply"
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               example: "2024-08-17T12:30:00Z"
 *                       totalReplies:
 *                         type: number
 *                         example: 1
 *       400:
 *         description: Bad Request - Possibly due to invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid query parameters"
 *       401:
 *         description: Unauthorized - User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access"
 *       500:
 *         description: Internal Server Error - Something went wrong on the server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred on the server"
 */


router
  .route("/:postId/comments/:commentId")
  .put(isAuthenticatedUser, editComment);

  /**
 * @swagger
 * /api/v1/posts/{postId}/comments/{commentId}:
 *   put:
 *     summary: Edit an existing comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post containing the comment to be edited
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment to be edited
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The updated text content of the comment
 *                 example: "This is an updated comment"
 *             required:
 *               - text
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Comment updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "6143c68f5e3e3f2b68d72b43"
 *                     text:
 *                       type: string
 *                       example: "This is an updated comment"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-08-17T12:00:00Z"
 *                     postId:
 *                       type: string
 *                       example: "6143c68f5e3e3f2b68d72b42"
 *       400:
 *         description: Bad Request - Possibly due to invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 *       401:
 *         description: Unauthorized - User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access"
 *       404:
 *         description: Comment Not Found - The specified comment does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Comment not found"
 *       500:
 *         description: Internal Server Error - Something went wrong on the server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred on the server"
 */


router
  .route("/:postId/comments/:commentId")
  .delete(isAuthenticatedUser, deleteComment);

  /**
 * @swagger
 * /api/v1/posts/{postId}/comments/{commentId}:
 *   delete:
 *     summary: Delete an existing comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post containing the comment to be deleted
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment to be deleted
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Comment deleted successfully"
 *       400:
 *         description: Bad Request - Possibly due to invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid request data"
 *       401:
 *         description: Unauthorized - User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access"
 *       404:
 *         description: Comment Not Found - The specified comment does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Comment not found"
 *       500:
 *         description: Internal Server Error - Something went wrong on the server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred on the server"
 */


router
  .route("/:postId/comments/:commentId/replies/:replyId")
  .put(isAuthenticatedUser, editReply);

  /**
 * @swagger
 * /api/v1/posts/{postId}/comments/{commentId}/replies/{replyId}:
 *   put:
 *     summary: Edit an existing reply
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post containing the comment with the reply to be edited
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment containing the reply to be edited
 *       - in: path
 *         name: replyId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the reply to be edited
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The updated text content of the reply
 *                 example: "This is an updated reply"
 *             required:
 *               - text
 *     responses:
 *       200:
 *         description: Reply updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Reply updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "6143c68f5e3e3f2b68d72b45"
 *                     text:
 *                       type: string
 *                       example: "This is an updated reply"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-08-17T12:30:00Z"
 *                     postId:
 *                       type: string
 *                       example: "6143c68f5e3e3f2b68d72b42"
 *                     parentCommentId:
 *                       type: string
 *                       example: "6143c68f5e3e3f2b68d72b43"
 *       400:
 *         description: Bad Request - Possibly due to invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid request data"
 *       401:
 *         description: Unauthorized - User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access"
 *       404:
 *         description: Reply Not Found - The specified reply does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Reply not found"
 *       500:
 *         description: Internal Server Error - Something went wrong on the server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred on the server"
 */


router
  .route("/:postId/comments/:commentId/replies/:replyId")
  .delete(isAuthenticatedUser, deleteReply);

 /**
 * @swagger
 * /api/v1/posts/{postId}/comments/{commentId}/replies/{replyId}:
 *   delete:
 *     summary: Delete an existing reply
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post containing the comment with the reply to be deleted
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment containing the reply to be deleted
 *       - in: path
 *         name: replyId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the reply to be deleted
 *     responses:
 *       200:
 *         description: Reply deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Reply deleted successfully"
 *       400:
 *         description: Bad Request - Possibly due to invalid request or parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid request"
 *       401:
 *         description: Unauthorized - User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access"
 *       404:
 *         description: Reply Not Found - The specified reply does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Reply not found"
 *       500:
 *         description: Internal Server Error - Something went wrong on the server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred on the server"
 */



module.exports = router;
