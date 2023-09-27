import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  likePost,
} from "../controllers/post.controller.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";
const postRouter = express.Router();

// route to create new post
postRouter.post("/create-post", isAuthenticatedUser, createPost);
// route to delete a post
postRouter.delete("/delete-post/:id", isAuthenticatedUser, deletePost);
// route to get all posts
postRouter.get("/get-all-posts", isAuthenticatedUser, getAllPosts);
// route to like a post
postRouter.put("/like-post/:id", isAuthenticatedUser, likePost);
// route to dislike a post
postRouter.put("/dislike-post/:id", isAuthenticatedUser, likePost);

export default postRouter;
