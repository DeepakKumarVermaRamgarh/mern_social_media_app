import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { generateLast12MonthsData } from "../utils/analytics.generator.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

// get posts analytics data
export const getPostsAnalytics = catchAsyncErrors(async (req, res, next) => {
  const postCount = await generateLast12MonthsData(req.user.id, Post);

  res.status(200).json({
    success: true,
    postCount,
  });
});

// get comments analytics data
export const getCommentsAnalytics = catchAsyncErrors(async (req, res, next) => {
  const commentsCount = await generateLast12MonthsData(req.user.id, Comment);
  res.status(200).json({
    success: true,
    commentsCount,
  });
});
