import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// @ts-ignore: no type declarations for 'react-lazy-load-image-component'
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Spinner from "../components/Spinner";
import { getExperienceById } from "../api/experience.Api";

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

  // Automatically select next available date
  useEffect(() => {
    if (data && !selectedDate) {
      const sortedDates = Object.keys(data.availableSlots).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );

      if (sortedDates.length > 0) {
        const nextDate = sortedDates[0];
        setSelectedDate(nextDate);
      }
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

  return (
    <div className="w-full py-6">
      {/* Back link */}
      <button
        onClick={() => history.back()}
        className="text-sm text-gray-500 mb-4 hover:underline"
      >
        ← Details
      </button>

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

          {/* Choose date */}
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

          {/* Choose time */}
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

        {/* Right section - Booking Summary */}
        <div className="bg-gray-50 rounded-xl p-5 h-fit">
          <div className="flex justify-between text-sm text-gray-700 mb-2">
            <p>Starts at</p>
            <p>₹{experience.price}</p>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-700 mb-2">
            <p>Quantity</p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDecrease}
                className="border rounded px-2 py-0.5"
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                onClick={handleIncrease}
                className="border rounded px-2 py-0.5"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-between text-sm text-gray-700 mb-1">
            <p>Subtotal</p>
            <p>₹{subtotal}</p>
          </div>

          <div className="flex justify-between text-sm text-gray-700 mb-3">
            <p>Taxes</p>
            <p>₹{taxes}</p>
          </div>

          <hr className="my-2" />

          <div className="flex justify-between font-semibold text-gray-900 text-base">
            <p>Total</p>
            <p>₹{total}</p>
          </div>

          <button
            disabled={!selectedDate || !selectedTime}
            className={`w-full mt-5 py-2 rounded-md text-sm font-medium ${
              !selectedDate || !selectedTime
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-yellow-400 text-black hover:bg-yellow-500"
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
