import { useLocation, useNavigate } from "react-router-dom";
import { CircleCheck, XCircle } from "lucide-react";

interface IBookingResult {
  success: boolean;
  booking?: {
    _id: string;
    refId?: string;
    experienceName?: string;
    date?: string;
    time?: string;
  };
}

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as IBookingResult | null;

  const isSuccess = state?.success;
  const refId = state?.booking?.refId || state?.booking?._id || "N/A";

  const handleBack = () => navigate("/");

  return (
    <div className="min-h-[90vh] flex flex-col justify-center items-center text-center">
      {/* Icon */}
      <div className="mb-6">
        {isSuccess ? (
          <CircleCheck className="text-green-500 w-16 h-16" strokeWidth={1} />
        ) : (
          <XCircle className="text-red-500 w-16 h-16" strokeWidth={1} />
        )}
      </div>

      {/* Title */}
      <h1 className="text-[32px] font-medium mb-4">
        {isSuccess ? "Booking Confirmed" : "Booking Failed"}
      </h1>

      {/* Reference ID */}
      <p className="text-grey6 text-xl mb-10">
        {isSuccess
          ? `Ref ID: ${refId}`
          : "Something went wrong while processing your booking."}
      </p>

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="bg-[#e3e3e3] text-grey5 hover:bg-gray-300 px-4 py-2 rounded-sm text-base font-normal transition-all cursor-pointer"
      >
        Back to Home
      </button>
    </div>
  );
};

export default Result;
