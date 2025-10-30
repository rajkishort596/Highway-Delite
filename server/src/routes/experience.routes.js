import { Router } from "express";
import {
  getExperienceById,
  getExperiences,
} from "../controllers/experience.controller.js";

const router = Router();

router.route("/").get(getExperiences);
router.route("/:id").get(getExperienceById);

export default router;
