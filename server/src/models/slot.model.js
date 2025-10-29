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
  },
  {
    timestamps: true,
  }
);

SlotSchema.virtual("isSoldOut").get(function () {
  return this.booked >= this.capacity;
});

export const Slot = mongoose.model("Slot", SlotSchema);
