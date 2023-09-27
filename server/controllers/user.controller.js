import * as cloudinary from "cloudinary";
import User from "../models/user.model.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendJWTToken,
} from "../utils/sendJWTToken.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

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

// function to update user details
export const updateUserDetails = catchAsyncErrors(async (req, res, next) => {
  const { name, avatar } = req.body;

  const user = await User.findById(req.user.id);

  if (name) user.name = name;

  if (avatar) {
    if (user.avatar) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    }
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
    });
    user.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user,
  });
});

// function to change password
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");

  //   check if old password is correct
  const isPasswordMatched = await user.comparePassword(oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  user.password = newPassword;

  await user.save();

  sendJWTToken(res, user, 200);
});

// function to forgot password
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("Invalid email", 404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `Dear ${user.name},\n\nYou have requested to reset your password. Please click on the link below to reset your password:\n\n${resetPasswordUrl}\n\nIf you have not requested this email, please ignore it. This link is valid only for 10 mintues.`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Social Media Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// function to reset password
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!token) {
    return next(new ErrorHandler("Token is invalid", 400));
  }
  if (!password) return next(new ErrorHandler("Password is required", 400));

  const decoded = jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET);
  const user = await User.findById(decoded.id).select("+password");
  user.password = password;
  await user.save();
  sendJWTToken(res, user, 200);
});

// function to get all users
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});
