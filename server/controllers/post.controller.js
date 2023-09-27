import cloudinary from "cloudinary";
import Post from "../models/post.model.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import mongoose from "mongoose";
import ErrorHandler from "../utils/ErrorHandler.js";
import Comment from "../models/comment.model.js";
import dotenv from "dotenv";
dotenv.config();

// function to create post
export const createPost = catchAsyncErrors(async (req, res, next) => {
  const { title, description, image } = req.body;

  if (!title || !description) {
    return next(new ErrorHandler("Title and description are required", 400));
  }

  if (image) {
    const myCloud = await cloudinary.v2.uploader.upload(image, {
      folder: "posts",
    });
    req.body.image = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const post = await Post.create({
    title,
    description,
    image,
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    post,
  });
});

// function to get all posts
export const getAllPosts = catchAsyncErrors(async (req, res, next) => {
  // get post with populating user name and comments
  const posts = await Post.find().populate("user", "name").populate("comments");

  res.status(200).json({
    success: true,
    posts,
  });
});

// funtion to like a post
export const likePost = catchAsyncErrors(async (req, res, next) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return next(new ErrorHandler("Invalid post id", 404));
  }

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  const index = post.likes.findIndex((id) => id === req.user.id);

  if (index === -1) {
    post.likes.push(req.user.id);
  } else {
    post.likes = post.likes.filter((id) => id !== req.user.id);
  }

  await post.save();

  res.status(200).json({
    success: true,
    message: "Post liked successfully",
  });
});

// function to dislike a post
export const dislikePost = catchAsyncErrors(async (req, res, next) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return next(new ErrorHandler("Invalid post id", 404));
  }

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  const index = post.dislikes.findIndex((id) => id === req.user.id);

  if (index === -1) {
    post.dislikes.push(req.user.id);
  } else {
    post.dislikes = post.dislikes.filter((id) => id !== req.user.id);
  }

  await post.save();

  res.status(200).json({
    success: true,
    message: "Post disliked successfully",
  });
});

// function to share a post
export const sharePost = catchAsyncErrors(async (req, res, next) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return next(new ErrorHandler("Invalid post id", 404));
  }

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  const index = post.shares.findIndex((id) => id === req.user.id);

  if (index === -1) {
    post.shares.push(req.user.id);
  } else {
    post.shares = post.shares.filter((id) => id !== req.user.id);
  }

  await post.save();

  res.status(200).json({
    success: true,
    message: "Post shared successfully",
  });
});

// function to delete a post
export const deletePost = catchAsyncErrors(async (req, res, next) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return next(new ErrorHandler("Invalid post id", 404));
  }

  const post = await Post.findOneAndDelete({ _id: postId, user: req.user.id });

  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  if (post.image) {
    await cloudinary.v2.uploader.destroy(post.image.public_id);
  }

  // console.log("above");
  // const info = await post.deleteOne({});
  // console.log("below");

  // delete all comments of the post
  await Comment.deleteMany({ commentedOn: postId });

  return res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});
