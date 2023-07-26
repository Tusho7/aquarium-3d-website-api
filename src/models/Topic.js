import mongoose from "mongoose";
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
    type: String,
    ref: "User",
    required: true,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
}); 

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;

