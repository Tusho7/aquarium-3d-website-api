import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
