import { Router } from "express";
import { validatePromo } from "../controllers/promo.controller.js";

const router = Router();

router.route("/validate").post(validatePromo);

export default router;
