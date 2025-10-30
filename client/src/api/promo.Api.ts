import axios from "../axios.ts";

export const validatePromo = async (code: string, subtotal: number) => {
  try {
    const res = await axios.post("/promo/validate", { code, subtotal });
    return res.data.data;
  } catch (error) {
    console.error("Failed to validate promo code");
  }
};
