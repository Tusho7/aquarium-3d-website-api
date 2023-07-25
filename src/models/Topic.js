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
  }
}, { timestamps: true }); 

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;

