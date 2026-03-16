import mongoose from "mongoose";

const EmergencyEventSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, default: "" },
  caregiverNumber: { type: String, required: true },
  timestamp: { type: Date, required: true },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  mapsLink: { type: String, default: null },
  status: {
    type: String,
    enum: ["pending", "notified", "failed"],
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.model("EmergencyEvent", EmergencyEventSchema);
