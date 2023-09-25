// importing mongoose
import mongoose from "mongoose";

// creating comment model
const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, "Please provide comment"],
    minlength: [3, "Comment must be at least 3 characters"],
    maxlength: [500, "Comment must be less than 500 characters"],
  },
  madeBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  commentedOn: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
    required: true,
  },
});

// creating model from schema and exporting
const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
