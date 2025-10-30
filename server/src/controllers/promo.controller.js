import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

// Predefined promo codes (extendable)
const PROMO_CODES = {
  SAVE10: { type: "percent", value: 10 }, // 10% off
  FLAT100: { type: "flat", value: 100 }, // ₹100 off
};

/**
 * @desc    Validate and apply promo code
 * @route   POST /api/promo/validate
 * @access  Public
 */
const validatePromo = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;

  if (!code || !subtotal) {
    throw new ApiError(400, "Promo code and subtotal are required");
  }

  const promo = PROMO_CODES[code.trim().toUpperCase()];
  if (!promo) {
    throw new ApiError(404, "Invalid promo code");
  }

  let discount = 0;

  if (promo.type === "percent") {
    discount = Math.round((subtotal * promo.value) / 100);
  } else if (promo.type === "flat") {
    discount = promo.value;
  }

  const newTotal = Math.max(subtotal - discount, 0);

  const promoResponse = {
    code: code.toUpperCase(),
    discount,
    newTotal,
    description:
      promo.type === "percent"
        ? `${promo.value}% discount applied`
        : `Flat ₹${promo.value} off`,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, promoResponse, "Promo code applied successfully")
    );
});

export { validatePromo };
