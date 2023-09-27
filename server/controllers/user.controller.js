import User from "../models/user.model.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendJWTToken,
} from "../utils/sendJWTToken.js";
import jwt from "jsonwebtoken";

// function to register user
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  //   check for all fields
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  //   check if email already exists
  const isEmailExists = await User.findOne({ email });

  if (isEmailExists) return next(new ErrorHandler("Email already exists", 400));

  const user = await User.create({
    name,
    email,
    password,
  });

  //   send login token
  sendJWTToken(res, user, 201);
});

// function to login user using email and password
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //   check if email and password exist
  if (!email || !password) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  //   check if user exists
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  //   check if password is correct
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  //   send login token
  sendJWTToken(res, user, 200);
});

// function to update access token using refresh token
export const updateAccessToken = catchAsyncErrors(async (req, res, next) => {
  const { refresh_token } = req.cookies;

  if (!refresh_token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  //   verify refresh token
  const decoded = jwt.verify(
    refresh_token,
    process.env.JWT_REFRESH_TOKEN_SECRET
  );

  if (!decoded) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  //   find user by id
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //   reassign the accesstoken and refresh token value in cookies
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: "5m",
    }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  req.user = user;

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  //   send access token
  sendJWTToken(res, user, 200);
});

// funtion to logout user
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("access_token", null, { maxAge: 0 });
  res.cookie("refresh_token", null, { maxAge: 0 });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// function to get user details
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});
