import mongoose from "mongoose";

const { Schema } = mongoose;

const fishSchema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
  },
  category: {
    type: Schema.Types.String,
    required: true,
  },
  careLevel: {
    type: Schema.Types.String,
    required: true,
  },
  watertemp: {
    type: Schema.Types.String,
    required: true,
  },
  about: {
    type: Schema.Types.String,
    required: true,
  },
  size: {
    type: Schema.Types.String,
    required: true,
  },
  parameters: {
    type: Schema.Types.String,
    required: true,
  },
  lifespan: {
    type: Schema.Types.String,
    required: true,
  },
  minimumTankSize: {
    type: Schema.Types.String,
    required: true,
  },
  food: {
    type: Schema.Types.String,
    required: true,
  },
  images: [
    {
      type: Schema.Types.String,
      required: true,
    },
  ],
  id: {
    type: Schema.Types.Number,
    required: true,
  },
});

const Fish = mongoose.model("Fish", fishSchema);

export default Fish;
