import express from "express";
import cors from "cors";
import { asyncHandler } from "./utils/AsyncHandler.js";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.get(
  "/",
  asyncHandler((req, res) => {
    res.send("Highway Delite Api is running");
  })
);

import experienceRoter from "./routes/experience.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import promoRouter from "./routes/promo.routes.js";

app.use("/api/v1/experiences", experienceRoter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/promo", promoRouter);

import { errorHandler } from "./middlewares/errorHandler.middleware.js";

app.use(errorHandler);

export { app };
