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

const parseTime = (timeString) => {
  const [time, meridian] = timeString.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (meridian === "PM" && hours !== 12) hours += 12;
  if (meridian === "AM" && hours === 12) hours = 0;

  return { hours, minutes };
};

const getExperienceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const experience = await Experience.findById(id);
  if (!experience) {
    throw new ApiError(404, "Experience not found");
  }

  const now = new Date();
  const todayDateKey = now.toISOString().split("T")[0];

  const todayMidnight = new Date(todayDateKey);

  // 1. Fetch slots: Query slots starting from midnight today and all future dates.
  const slots = await Slot.find({
    experience: id,
    date: { $gte: todayMidnight },
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

  // 2. Filter slots: Exclude past times on the current day in Node.js.
  const futureSlots = slots.filter((slot) => {
    const slotDateKey = slot.date.toISOString().split("T")[0];

    if (slotDateKey > todayDateKey) {
      return true;
    }

    if (slotDateKey === todayDateKey) {
      const { hours, minutes } = parseTime(slot.time);

      const slotDateTime = new Date(now);
      slotDateTime.setHours(hours, minutes, 0, 0);

      return slotDateTime > now;
    }

    return false;
  });

  // 3. Group slots: Group the filtered future slots by date.
  const groupedSlots = futureSlots.reduce((acc, slot) => {
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

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { experience, availableSlots: groupedSlots },
        "Experience details fetched successfully"
      )
    );
});

export { getExperiences, getExperienceById };
