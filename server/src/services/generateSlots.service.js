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
    today.setHours(0, 0, 0, 0); // Reset time part to start of day

    for (const exp of experiences) {
      const { frequency, times, capacityPerSlot, customDays } = exp;

      for (let i = 0; i < daysAhead; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const day = date.getDay();
        const dayOfMonth = date.getDate();

        let shouldCreate = false;

        if (frequency === "daily") shouldCreate = true;
        else if (frequency === "weekends" && (day === 0 || day === 6))
          shouldCreate = true;
        else if (frequency === "custom" && customDays?.includes(dayOfMonth))
          shouldCreate = true;

        if (!shouldCreate) continue;

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Create all slots for this date in bulk after checking existence
        const existingSlots = await Slot.find({
          experience: exp._id,
          date: { $gte: startOfDay, $lt: endOfDay },
        });

        const existingTimes = new Set(existingSlots.map((slot) => slot.time));

        const newSlots = times
          .filter((time) => !existingTimes.has(time))
          .map((time) => ({
            experience: exp._id,
            date,
            time,
            capacity: capacityPerSlot,
            booked: 0,
          }));

        if (newSlots.length > 0) {
          await Slot.insertMany(newSlots);
        }
      }
    }

    console.log("✅ Slot generation complete.");
  } catch (error) {
    console.error("❌ Slot generation failed:", error);
  }
};

const startGenerationJob = async (daysAhead = 5) => {
  // Run every day at midnight (server time)
  cron.schedule("0 0 * * *", async () => {
    await generateFutureSlots(daysAhead);
  });
};

export { startGenerationJob };
