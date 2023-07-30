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
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  likes: [
    {
      type: String,
      ref: "User",
    },
  ],
  totalLikes: {
    type: Number,
    default: 0,
  },
  edited: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: null
  },
  topicId: {
    type: Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
