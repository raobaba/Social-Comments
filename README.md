# Project Title
Multi-Level Comment System
## Swagger-OPENAPI-Documentation

[Swagger Documentation](https://ecommerceplus-server.onrender.com/api-docs)

## Introduction

### Multi-Level Comment System API
- Allows users to create posts with titles, content, and optional images.
- Fetches posts with associated comments, including pagination and sorting options.
- Enables users to update their own posts, including changing content and images.
- Allows users to delete their own posts, including associated images.
- Lets users add comments to posts, with optional images.
- Supports creating replies to existing comments, with optional images.
- Fetches comments for a post, including pagination and sorting options, with recent replies included.
- Enables users to update their own comments, including text and images.
- Allows users to delete their own comments, including replies.
- Lets users update their own replies to comments.
- Supports deleting replies to comments.

## Project Type
 Backend 

## Deplolyed App
```bash
Backend: https://ecommerceplus-server.onrender.com/
Database: mongodb+srv://YOUR_USERNAME:YUOR_PASSWORD@cluster0.vvtoxbl.mongodb.net/social?retryWrites=true&w=majority
```
## Directory Structure
```bash
Multi-Level-Comment-System-Assignment/
├─ social/
  ├─ client/
  ├─ server/
   ├─ docs/
   │  ├─ swagger.js
   ├─ src/
   │  ├─ config/
   │  │  └─ database.js
   │  ├─ models/
   │  │  └─ comment.model.js
   │  │  └─ post.model.js
   │  │  └─ user.model.js
   │  ├─ controllers/
   │  │  └─ comment.contorller.js
   │  │  └─ post.controller.js
   │  │  └─ user.contorller.js
   │  ├─ routes/
   │  │  └─ comment.route.js
   │  │  └─ post.route.js
   │  │  └─ index.js
   │  │  └─ user.route.js
   │  ├─ app.js
   │  └─ index.js
   └─ .env
   └─ .gitignore
   └─ package-lock.json
   └─ package.json
 
```



## Video Walkthrough of the project
Attach a very short video walkthough of all of the features [ 1 - 3 minutes ]

## Video Walkthrough of the codebase
Attach a very short video walkthough of codebase [ 1 - 5 minutes ]

## Features
- The application features multi-level commenting with nested replies and user details, supports images in both posts and comments, and includes pagination and sorting for efficient management of large comment volumes, all while ensuring secure operations through user authentication.

## Design Decisions & Assumptions:

### Node.js Multi-Level Comment System API:
- Choose Node.js for backend.
- Utilize Express.js for API.
- Implement JWT for authentication.
- Use MongoDB for storage.
- Assume basic security measures.
- Prioritize scalability and performance.


## Installation & Getting started
Detailed instructions on how to install, configure, and get the project running. For BE projects, guide the reviewer how to check mongodb schema etc.

```bash
git clone <complete_repository> 
For Backend:-
cd Server
npm install 
npm start

```

## Usage
Provide instructions and examples on how to use your project.

```bash
# Example
```

## Credentials
Include screenshots as necessary.
```bash
# MongoURL
mongoURL= YOUR_MONGODB_URL_HERE
# PORT
PORT=8000
NODE_ENV=development
# Cookie expiry
COOKIE_EXPIRE=5
# JWT secret and expiry
JWT_SECRET=YOUR_JWT_SECRET_HERE
JWT_EXPIRE=2h
# Cloudinary Credentials
CLOUDINARY_NAME=CLOUDINARY_NAME
CLOUDINARY_API_KEY=CLOUDINARY_API_KEY
CLOUDINARY_SECRET_KEY=CLOUDINARY_SECRET_KEY


```

## APIs Used
If your application relies on external APIs, document them and include any necessary links or references.

## API Endpoints
### User Management:
- `POST /api/v1/users/register`: Register a new user.
- `POST /api/v1/users/login`: User login.
- `GET /api/v1/users/logout`: User logout.
- ### Post Management:
- `POST /api/v1/posts`: Create a new post.
- `GET /api/v1/posts`: Get all posts.
- `GET /api/v1/post/:{postId}`: Get Post By Id.
- `PUT /api/v1/post/:{postId}`: Update Post.
- `DELETE /api/v1/post/:{postId}`: Delete Post.
- ### Comment Management:
- `POST /api/v1/posts/{postId}/comments`: Create a new comment on a post.
- `GET /api/v1/posts/{postId}/comments`:Get comments for a post.
- `POST /api/v1/posts/{postId}/comments/{commentId}/reply`: Reply to an existing comment.
- `GET /api/v1/posts/{postId}/comments/{commentId}/expand`: Expand parent-level comments with pagination.
- `PUT /api/v1/posts/{postId}/comments/{commentId}`: Edit an existing comment.
- `DELETE /api/v1/posts/{postId}/comments/{commentId}`: Delete an existing comment.
- `PUT /api/v1/posts/{postId}/comments/{commentId}/replies/{replyId}`:Edit an existing reply.
- `DELETE /api/v1/posts/{postId}/comments/{commentId}/replies/{replyId}`: Delete an existing reply.

## Technology Stack
- Node.js
- Express.js
- MongoDB

