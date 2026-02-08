// src/models/HealthcareFacility.js
import mongoose from "mongoose";

const healthcareFacilitySchema = new mongoose.Schema({
  name: String,
  type: {
    type: String, // clinic, hospital, phc
    enum: ["clinic", "hospital", "phc"],
  },
  address: String,
  latitude: Number,
  longitude: Number,
});

export default mongoose.model(
  "HealthcareFacility",
  healthcareFacilitySchema
);
