import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5050;

mongoose.connection.once("open", () => {
  console.log("MongoDB Atlas connected");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

app.listen(PORT, () => {
  console.log(`CareCircle backend running on port 5050`);
});
