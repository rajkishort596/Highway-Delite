import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { validatePromo } from "../api/promo.Api";
import { createBooking } from "../api/booking.Api";
import { ArrowLeft } from "lucide-react";

interface ICheckoutFormInputs {
  fullName: string;
  email: string;
  promoCode?: string;
  agree: boolean;
}

interface ICheckoutData {
  slotId: string;
  experienceId: string;
  quantity: number;
  date: string;
  time: string;
  experienceName: string;
  price: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const bookingData = location.state as ICheckoutData | null;

  useEffect(() => {
    if (!bookingData) {
      navigate("/", { replace: true });
    }
  }, [bookingData, navigate]);

  if (!bookingData) return null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ICheckoutFormInputs>({
    defaultValues: { fullName: "", email: "", promoCode: "", agree: false },
  });

  const [discount, setDiscount] = useState(0);
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [promoMsg, setPromoMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const promoCode = watch("promoCode");

  // Calculate subtotal (price * qty)
  const baseSubtotal = bookingData.price * bookingData.quantity;
  const subtotal = baseSubtotal - discount;
  const taxes = Math.round(subtotal * 0.06); //6% GST
  const total = subtotal + taxes;

  const handleApplyPromo = async () => {
    if (!promoCode) return setPromoError("Enter a promo code");
    setApplyingPromo(true);
    setPromoError("");
    setPromoMsg("");

    try {
      const data = await validatePromo(promoCode, baseSubtotal);
      if (data) {
        setDiscount(data.discount);
        setPromoMsg(data.description);
      } else {
        setPromoError("Invalid promo code");
        setDiscount(0);
      }
    } catch {
      setPromoError("Error validating promo");
      setDiscount(0);
    } finally {
      setApplyingPromo(false);
    }
  };

  const onSubmit = async (formData: ICheckoutFormInputs) => {
    if (!formData.agree) return;

    const payload = {
      slotId: bookingData.slotId,
      experienceId: bookingData.experienceId,
      fullName: formData.fullName,
      email: formData.email,
      quantity: bookingData.quantity,
      promoCode: formData.promoCode || "",
    };

    setLoading(true);
    try {
      const result = await createBooking(payload);
      navigate("/result", { state: { success: !!result, booking: result } });
    } catch {
      navigate("/result", { state: { success: false } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col py-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-black cursor-pointer"
        >
          <ArrowLeft strokeWidth={1} />
        </button>
        <h1 className="text-lg font-medium text-gray-800">Checkout</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-10 w-full">
        {/* LEFT SIDE */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-grey1 p-6 rounded-lg shadow-sm flex-1"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-[#5b5b5b] text-sm">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your Name"
                id="fullName"
                {...register("fullName", { required: "Name is required" })}
                className="w-full rounded-md py-3 px-4 bg-[#dddddd] placeholder-grey7 text-sm"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[#5b5b5b] text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Your Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                className="w-full rounded-md py-3 px-4 bg-[#dddddd] placeholder-grey7 text-sm"
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Promo code"
              {...register("promoCode")}
              className="flex-1 rounded-md py-3 px-4 bg-[#dddddd] placeholder-grey7 text-sm"
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              disabled={applyingPromo}
              className="bg-black text-bg px-4 py-3 rounded-lg hover:bg-gray-800 text-sm font-medium"
            >
              {applyingPromo ? "Checking..." : "Apply"}
            </button>
          </div>

          {promoError && (
            <p className="text-red-500 text-sm mb-2">{promoError}</p>
          )}
          {promoMsg && (
            <p className="text-green-500 text-sm mb-2">{promoMsg}</p>
          )}

          <label className="flex items-center text-sm gap-2 mt-3 text-[#5b5b5b]">
            <input
              type="checkbox"
              {...register("agree", { required: true })}
              className="accent-black w-4 h-4"
            />
            <span>
              I agree to the{" "}
              <span className="cursor-pointer">terms and safety policy</span>
            </span>
          </label>
          {errors.agree && (
            <p className="text-red-500 text-sm mt-1">
              You must agree to continue
            </p>
          )}
        </form>

        {/* RIGHT SIDE - SUMMARY */}
        <div className="bg-grey1 p-6 rounded-xl shadow-sm w-full md:w-[320px]">
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex justify-between">
              <span>Experience</span>
              <span className="text-black text-base">
                {bookingData.experienceName}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Date</span>
              <span className="text-black text-sm">{bookingData.date}</span>
            </p>
            <p className="flex justify-between">
              <span>Time</span>
              <span className="text-black text-sm">{bookingData.time}</span>
            </p>
            <p className="flex justify-between">
              <span>Qty</span>
              <span className="text-black text-sm">{bookingData.quantity}</span>
            </p>

            <p className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-black text-sm">₹{baseSubtotal}</span>
            </p>
            {discount > 0 && (
              <p className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </p>
            )}
            <p className="flex justify-between">
              <span>Taxes</span>
              <span className="text-black text-sm">₹{taxes}</span>
            </p>
            <hr className="my-4 bg-[#d9d9d9] h-px" />
            <p className="flex justify-between text-xl font-medium text-black">
              <span>Total</span>
              <span>₹{total}</span>
            </p>
          </div>
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="mt-6 w-full bg-yellow hover:bg-[#ffcd1f] py-3 px-5 rounded-lg font-medium cursor-pointer text-black text-base"
          >
            {loading ? "Processing..." : "Pay and Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
