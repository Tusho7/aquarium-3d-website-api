import mongoose from "mongoose";

const { Schema } = mongoose

const plantSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
      },
      growrate: {
        type: Schema.Types.String,
        required: true,
      },
      height: {
        type: Schema.Types.String,
        required: true,
      },
      light: {
        type: Schema.Types.String,
        required: true,
      },
      co2: {
        type: Schema.Types.String,
        required: true,
      },
      images: {
        png: {
          type: Schema.Types.String,
          required: true,
        },
      },
      id: {
        type: Schema.Types.Number,
        required: true,
      },
})

const Plant = mongoose.model("Plant", plantSchema)

export default Plant

