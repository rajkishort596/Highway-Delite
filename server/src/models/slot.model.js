import mongoose, { Schema } from "mongoose";

const SlotSchema = new Schema(
  {
    experience: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experience",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    booked: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    isSoldOut: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Slot = mongoose.model("Slot", SlotSchema);
