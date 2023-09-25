// configuring environment variables
// importing dotenv
import dotenv from "dotenv";

// importing path
dotenv.config();

// configuring app
import app from "./app.js";

// handle unhandled promise rejections

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to unhandled promise rejection`);
  process.exit(1);
});

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
