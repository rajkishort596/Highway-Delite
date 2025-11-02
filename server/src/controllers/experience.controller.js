import { Experience } from "../models/experience.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Slot } from "../models/slot.model.js";

const getExperiences = asyncHandler(async (req, res) => {
  const experiences = await Experience.find({}).sort({ createdAt: 1 });

  if (!experiences) {
    throw new ApiError(404, "No expereinces found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, experiences, "Experiences fetched successfully")
    );
});

const getExperienceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const experience = await Experience.findById(id);
  if (!experience) {
    throw new ApiError(404, "Experience not found");
  }

  const today = new Date();

  const slots = await Slot.find({
    experience: id,
    date: { $gte: today },
  })
    .sort({ date: 1, time: 1 })
    .select("date time capacity booked isSoldOut");

  if (!slots.length) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { experience, availableSlots: {} },
          "No upcoming slots available"
        )
      );
  }

  // Group slots by date
  const groupedSlots = slots.reduce((acc, slot) => {
    const dateKey = slot.date.toISOString().split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push({
      _id: slot._id,
      time: slot.time,
      capacity: slot.capacity,
      booked: slot.booked,
      remaining: slot.capacity - slot.booked,
      isSoldOut: slot.isSoldOut || slot.booked >= slot.capacity,
    });
    return acc;
  }, {});

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        experience,
        availableSlots: groupedSlots,
      },
      "Experience details fetched successfully"
    )
  );
});

export { getExperiences, getExperienceById };
