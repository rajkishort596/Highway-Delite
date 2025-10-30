import { Router } from "express";
import { createBooking } from "../controllers/booking.controller.js";

const router = Router();

router.route("/").post(createBooking);

export default router;
