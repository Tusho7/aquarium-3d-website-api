import mongoose from "mongoose";

const { Schema } = mongoose;

const fishSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  careLevel: {
    type: String,
    required: true,
  },
  watertemp: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  parameters: {
    type: String,
    required: true,
  },
  lifespan: {
    type: String,
    required: true,
  },
  minimumTankSize: {
    type: String,
    required: true,
  },
  food: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
});

const Fish = mongoose.model("Fish", fishSchema);

export default Fish;
