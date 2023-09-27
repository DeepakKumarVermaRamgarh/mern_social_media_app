import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";

// middleware funtion to check is user is authenticated or not
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { access_token } = req.cookies;

  if (!access_token || access_token === "undefined" || access_token === "") {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  // verity access token
  const decoded = jwt.verify(access_token, process.env.JWT_ACCESS_TOKEN_SECRET);

  if (!decoded) {
    return next(new ErrorHandler("Invalid access token", 401));
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  req.user = user;

  next();
});
