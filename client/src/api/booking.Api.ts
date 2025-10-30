import axios from "../axios.ts";

export const createBooking = async (data: any) => {
  try {
    const res = await axios.post("/bookings", data);
    return res.data.data;
  } catch (error) {
    console.error("Failed to create booking");
  }
};
