import express from "express";
import { asyncHandler } from "./utils/AsyncHandler.js";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.get(
  "/",
  asyncHandler((req, res) => {
    res.send("Highway Delite Api is running");
  })
);

import { errorHandler } from "./middlewares/errorHandler.middleware.js";

app.use(errorHandler);

export { app };
