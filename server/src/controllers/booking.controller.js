import mongoose from "mongoose";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Slot } from "../models/slot.model.js";
import { Experience } from "../models/experience.model.js";
import { Booking } from "../models/booking.model.js";

const PROMO_CODES = {
  SAVE10: { type: "percent", value: 10 },
  FLAT100: { type: "flat", value: 100 },
};

/**
 * @desc    Create a new booking and update slot capacity
 * @route   POST /api/bookings
 * @access  Public
 */
const createBooking = asyncHandler(async (req, res) => {
  const { slotId, experienceId, fullName, email, quantity, promoCode } =
    req.body;

  if (!slotId || !experienceId || !fullName || !email || !quantity) {
    throw new ApiError(400, "All required fields must be provided");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const experience = await Experience.findById(experienceId);
    if (!experience) throw new ApiError(404, "Experience not found");

    const slot = await Slot.findOne({
      _id: slotId,
      experience: experienceId,
    }).session(session);

    if (!slot) throw new ApiError(404, "Slot not found");

    if (slot.booked + quantity > slot.capacity) {
      throw new ApiError(400, "Not enough seats available for this slot");
    }

    let subtotal = experience.price * quantity;
    let discount = 0;

    if (promoCode && PROMO_CODES[promoCode.toUpperCase()]) {
      const { type, value } = PROMO_CODES[promoCode.toUpperCase()];
      discount =
        type === "percent" ? Math.round((subtotal * value) / 100) : value;
    }

    subtotal -= discount;
    const taxes = Math.round(subtotal * 0.06); // 6% GST
    const totalAmount = subtotal + taxes;

    const refId = `HD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const [booking] = await Booking.create(
      [
        {
          slot: slotId,
          experience: experienceId,
          refId,
          fullName,
          email,
          quantity,
          subtotal,
          taxes,
          totalAmount,
          promoCodeUsed: promoCode || null,
        },
      ],
      { session }
    );

    slot.booked += quantity;
    if (slot.booked >= slot.capacity) slot.isSoldOut = true;
    await slot.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(201)
      .json(new ApiResponse(201, booking, "Booking created successfully"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, error.message || "Failed to create booking");
  }
});

export { createBooking };
