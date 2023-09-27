import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import mongoose from "mongoose";
import ErrorHandler from "../utils/ErrorHandler.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

// function to create a comment on a post
export const createComment = catchAsyncErrors(async (req, res, next) => {
  const { postId } = req.params;
  const { comment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return next(new ErrorHandler("Invalid Post Id", 404));
  }

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  const newComment = {
    comment,
    commentedBy: req.user._id,
  };

  post.comments.push(newComment);

  await post.save();

  await Comment.create({
    comment,
    commentedBy: req.user._id,
    commentedOn: postId,
  });

  res.status(201).json({
    success: true,
    message: "Comment created successfully",
  });
});

// function to get all comments on a post
export const getAllComments = catchAsyncErrors(async (req, res, next) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return next(new ErrorHandler("Invalid Post Id", 404));
  }

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  const comments = await Comment.find({ commentedOn: postId });

  res.status(200).json({
    success: true,
    message: "Comments fetched successfully",
    comments: comments,
  });
});

// function to reply on a comment
export const replyOnComment = catchAsyncErrors(async (req, res, next) => {
  const { commentId } = req.params;
  const { reply } = req.body;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return next(new ErrorHandler("Invalid Comment Id", 404));
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return next(new ErrorHandler("Comment not found", 404));
  }

  const newReply = {
    reply,
    repliedBy: req.user._id,
  };

  comment.replies.push(newReply);

  await comment.save();

  res.status(201).json({
    success: true,
    message: "Reply created successfully",
    reply: newReply,
  });
});
