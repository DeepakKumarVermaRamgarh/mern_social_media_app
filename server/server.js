// configuring environment variables
// importing dotenv
import dotenv from "dotenv";
import cloudinary from "cloudinary";

// importing path
dotenv.config();

// configuring cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// configuring app
import app from "./app.js";
import { connectDB } from "./utils/database.js";

// handle unhandled promise rejections

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to unhandled promise rejection`);
  process.exit(1);
});

// connect to database
connectDB();

// starting server

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// handle uncaught exceptions

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to uncaught exception`);
  //   closing the server
  server.close(() => {
    process.exit(1);
  });
});
