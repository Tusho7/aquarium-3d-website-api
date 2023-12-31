import mongoose from "mongoose";

const { Schema } = mongoose;

const replySchema = new Schema({
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
    avatar: {
      type: String,
      required: true,
      ref: "User",
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
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
    default: false,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

const Reply = mongoose.model("Reply", replySchema);

export default Reply;
