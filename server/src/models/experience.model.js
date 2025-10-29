import mongoose, { Schema } from "mongoose";

const ExperienceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      required: true,
    },

    includes: [
      {
        type: String,
      },
    ],

    minAge: {
      type: Number,
      min: 1,
      default: 10,
    },

    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const Experience = mongoose.model("Experience", ExperienceSchema);
