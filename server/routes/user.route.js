// import express router
import express from "express";
import {
  forgotPassword,
  getUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateAccessToken,
  updatePassword,
} from "../controllers/user.controller.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";
const userRouter = express.Router();

// route to register
userRouter.post("/register", registerUser);
// route to login user
userRouter.post("/login", loginUser);
// route to update access token
userRouter.get("/update-token", updateAccessToken);
// route to logout
userRouter.get("/logout", isAuthenticatedUser, logoutUser);
// route to get profile
userRouter.get("/me", isAuthenticatedUser, getUserDetails);
// route to forgot password
userRouter.post("/password/forgot", forgotPassword);
// route to reset password
userRouter.post("/password/reset/:token", resetPassword);
// route to update password
userRouter.put(
  "/password/update-password",
  isAuthenticatedUser,
  updatePassword
);

export default userRouter;
