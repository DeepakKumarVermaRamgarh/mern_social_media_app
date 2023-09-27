import express from "express";
import {
  createComment,
  getAllComments,
  replyOnComment,
} from "../controllers/comment.controller.js";
const commentRouter = express.Router();

// route to create a comment on a post
commentRouter.post("/create-comment/:postId", createComment);
// route to add reply on a comment
commentRouter.post("/add-reply/:commentId", replyOnComment);
// route to get all comments on a post
commentRouter.get("/get-comments/:postId", getAllComments);

export default commentRouter;
