import "dotenv/config";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import { startGenerationJob } from "./services/generateSlots.service.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, async () => {
      console.log(`⚙️ Server is running on port : ${process.env.PORT}`);
      await startGenerationJob(5);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });
