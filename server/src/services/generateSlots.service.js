import cron from "node-cron";
import mongoose from "mongoose";
import { Experience } from "../models/experience.model.js";
import { Slot } from "../models/slot.model.js";

/**
 * Utility function to generate slots for all experiences dynamically.
 * Runs daily at midnight and ensures upcoming slots are always available.
 */

const generateFutureSlots = async (daysAhead = 5) => {
  try {
    console.log("Running daily slot generation job...");

    const experiences = await Experience.find();
    const today = new Date();

    for (const exp of experiences) {
      const { frequency, times, capacityPerSlot, customDays } = exp;

      for (let i = 0; i < daysAhead; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const day = date.getDay(); // 0 = Sunday, 6 = Saturday
        const dayOfMonth = date.getDate();

        let shouldCreate = false;

        if (frequency === "daily") shouldCreate = true;
        else if (frequency === "weekends" && (day === 0 || day === 6))
          shouldCreate = true;
        else if (frequency === "custom" && customDays?.includes(dayOfMonth))
          shouldCreate = true;

        if (!shouldCreate) continue;

        for (const time of times) {
          const exists = await Slot.exists({ experience: exp._id, date, time });
          if (exists) continue; // prevent duplicates

          await Slot.create({
            experience: exp._id,
            date,
            time,
            capacity: capacityPerSlot,
            booked: 0,
          });
        }
      }
    }

    console.log("✅ Slot generation complete.");
  } catch (error) {
    console.error("❌ Slot generation failed:", err);
  }
};

const startGenerationJob = async (daysAhead = 5) => {
  // Run every day at midnight (server time)
  cron.schedule("0 0 * * *", async () => {
    await generateFutureSlots(daysAhead);
  });
  await generateFutureSlots(daysAhead);
};

export { startGenerationJob };
