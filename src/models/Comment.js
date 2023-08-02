import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdBy: {
      id: {
      type: String,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reply",
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  totalLikes: {
    type: Number,
    default: 0,
  },
  edited: {
    type: Boolean,
    default: false,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  topicId: {
    type: Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
