// import express router
import express from "express";
import {
  getUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  updateAccessToken,
} from "../controllers/user.controller.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/update-token", updateAccessToken);
userRouter.get("/logout", isAuthenticatedUser, logoutUser);

userRouter.get("/me", isAuthenticatedUser, getUserDetails);

export default userRouter;
