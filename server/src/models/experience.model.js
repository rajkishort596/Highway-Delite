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
      trim: true,
    },

    includes: [
      {
        type: String,
        trim: true,
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
      trim: true,
    },

    frequency: {
      type: String,
      enum: ["daily", "weekends", "custom"],
      required: true,
    },

    times: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    capacityPerSlot: {
      type: Number,
      required: true,
      min: 1,
      default: 10,
    },

    customDays: [
      {
        type: Number,
        min: 1,
        max: 31,
      },
    ],
  },
  {
    timestamps: true,
  }
);

ExperienceSchema.index({ name: 1, location: 1 });

export const Experience = mongoose.model("Experience", ExperienceSchema);
