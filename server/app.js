// importing express
import express, { urlencoded } from "express";
import { errorMiddleWare } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";

// intializing app
const app = express();

// app middlewares
app.use(express.json({ limit: "50mb" }));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", userRouter, postRouter, commentRouter);

// all other routes
app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} does not exist`);
  err.statusCode = 404;
  next(err);
});

app.use(errorMiddleWare);

// exporting app
export default app;
