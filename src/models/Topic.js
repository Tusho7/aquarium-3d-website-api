import mongoose from "mongoose";
import Comment from "./Comment";
const { Schema } = mongoose;

const topicSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
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
  comments: [Comment],
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: [
    {
      type: String,
      ref: "User",
    }
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
  }
}); 

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;

