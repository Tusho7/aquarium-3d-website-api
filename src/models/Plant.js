import mongoose from "mongoose";

const { Schema } = mongoose

const plantSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
      },
      co2: {
        type: Schema.Types.String,
        required: true,
      },
      growthRate: {
        type: Schema.Types.String,
        required: true,
      },
      care: {
        type: Schema.Types.String,
        required: true,
      },
      light: {
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
      images: [
        {
          type: String,
          required: true,
        },
      ],
      id: {
        type: Schema.Types.Number,
        required: true,
      },
})

const Plant = mongoose.model("Plant", plantSchema)

export default Plant

