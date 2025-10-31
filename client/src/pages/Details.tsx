import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// @ts-ignore
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Spinner from "../components/Spinner";
import { getExperienceById } from "../api/experience.Api";
import { ArrowLeft } from "lucide-react";

interface Slot {
  _id: string;
  time: string;
  capacity: number;
  booked: number;
  remaining: number;
  isSoldOut: boolean;
}

interface Experience {
  _id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  minAge: number;
  imageUrl: string;
  includes: string[];
}

interface ApiResponse {
  experience: Experience;
  availableSlots: Record<string, Slot[]>; // date -> slots[]
}

const Details = () => {
  const { experienceId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<ApiResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // Fetch experience details
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const result = await getExperienceById(experienceId);
        setData(result);
      } catch (error) {
        console.error("Error fetching experience details:", error);
      }
    };

    fetchExperience();
  }, [experienceId]);

  // Auto select next available date
  useEffect(() => {
    if (data && !selectedDate) {
      const sortedDates = Object.keys(data.availableSlots).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );
      if (sortedDates.length > 0) setSelectedDate(sortedDates[0]);
    }
  }, [data, selectedDate]);

  if (!data)
    return (
      <div className="flex items-center justify-center h-[90vh]">
        <Spinner />
      </div>
    );

  const { experience, availableSlots } = data;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const subtotal = experience.price * quantity;
  const taxes = Math.round(subtotal * 0.06);
  const total = subtotal + taxes;

  const dates = Object.keys(availableSlots).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  const times = selectedDate ? availableSlots[selectedDate] : [];

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;

    // Find the selected slot by time
    const selectedSlot = data?.availableSlots[selectedDate]?.find(
      (slot) => slot.time === selectedTime
    );

    if (!selectedSlot) {
      console.error("Selected slot not found!");
      return;
    }

    const bookingData = {
      slotId: selectedSlot._id,
      experienceId: experience._id,
      experienceName: experience.name,
      date: selectedDate,
      time: selectedTime,
      price: experience.price,
      quantity,
      total,
    };

    // Store for persistence
    localStorage.setItem("checkoutData", JSON.stringify(bookingData));

    // Navigate to checkout page and pass data
    navigate("/checkout", { state: bookingData });
  };

  return (
    <div className="w-full py-6">
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-black cursor-pointer"
        >
          <ArrowLeft strokeWidth={1} />
        </button>
        <h1 className="text-lg font-medium text-gray-800">Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left section */}
        <div className="md:col-span-2">
          <LazyLoadImage
            src={experience.imageUrl}
            alt={experience.name}
            effect="blur"
            wrapperClassName="w-full h-72 md:h-96 block rounded-lg overflow-hidden"
            className="w-full h-72 md:h-96 object-cover block"
          />

          <h1 className="text-2xl font-medium text-black mt-6">
            {experience.name}
          </h1>
          <p className="text-grey5 text-base mt-1">{experience.description}</p>

          {/* Date selection */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700">Choose date</h3>
            <div className="flex gap-4 mt-2 flex-wrap">
              {dates.map((date) => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedTime("");
                  }}
                  className={`px-3 py-2 text-sm rounded-sm cursor-pointer ${
                    selectedDate === date
                      ? "bg-yellow text-black font-normal text-sm"
                      : "border-[0.6px] border-grey9 text-grey4"
                  }`}
                >
                  {new Date(date).toDateString().slice(4, 10)}
                </button>
              ))}
            </div>
          </div>

          {/* Time selection */}
          {selectedDate && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700">Choose time</h3>
              <div className="flex gap-4 mt-2 flex-wrap">
                {times.map((slot) => (
                  <button
                    key={slot._id}
                    onClick={() =>
                      !slot.isSoldOut && setSelectedTime(slot.time)
                    }
                    disabled={slot.isSoldOut}
                    className={`px-3 py-2 text-sm rounded-md cursor-pointer flex items-center leading-none ${
                      slot.isSoldOut
                        ? "bg-[#ccc] text-grey4 cursor-not-allowed"
                        : selectedTime === slot.time
                        ? "bg-yellow text-black font-normal"
                        : "border-[0.6px] border-grey9 text-grey4"
                    }`}
                  >
                    {slot.time}
                    {!slot.isSoldOut && (
                      <span className="text-[10px] text-red-500 ml-1.5">
                        {slot.remaining} left
                      </span>
                    )}
                    {slot.isSoldOut && (
                      <span className="text-xs text-grey4 ml-1.5">
                        Sold out
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-grey4 text-sm mt-2">
            All times are in IST (GMT +5:30)
          </p>

          {/* About */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-700">About</h3>
            <p className="text-grey4 bg-[#eee] text-xs px-3 py-2 rounded-sm mt-2">
              Scenic routes, trained guides, and safety briefing. Minimum age{" "}
              {experience.minAge}.
            </p>
          </div>
        </div>

        {/* Right section */}
        <div className="bg-grey1 rounded-xl p-5 h-fit">
          <div className="flex justify-between text-sm text-grey6 mb-2">
            <p>Starts at</p>
            <p className="text-black text-lg">₹{experience.price}</p>
          </div>

          <div className="flex justify-between items-center text-sm text-grey6 mb-2">
            <p>Quantity</p>
            <div className="flex text-black items-center gap-3">
              <button
                onClick={handleDecrease}
                className="border border-[#c9c9c9] w-5 h-5 flex items-center justify-center text-xs font-bold leading-none"
              >
                −
              </button>
              <span className="text-lg">{quantity}</span>
              <button
                onClick={handleIncrease}
                className="border border-[#c9c9c9] w-5 h-5 flex items-center justify-center text-xs font-bold leading-none"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-between text-sm text-grey6 mb-2">
            <p>Subtotal</p>
            <p className="text-black text-sm">₹{subtotal}</p>
          </div>

          <div className="flex justify-between text-sm text-grey6 mb-3">
            <p>Taxes</p>
            <p className="text-black text-sm">₹{taxes}</p>
          </div>

          <hr className="my-4 bg-[#d9d9d9] h-px" />

          <div className="flex justify-between font-semibold text-black text-xl">
            <p>Total</p>
            <p className="text-black">₹{total}</p>
          </div>

          <button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime}
            className={`w-full mt-5 py-3 px-5 rounded-md text-lg font-medium  ${
              !selectedDate || !selectedTime
                ? "bg-grey2 text-[#7f7f7f] cursor-not-allowed"
                : "bg-yellow text-black hover:bg-yellow-500 cursor-pointer"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;
