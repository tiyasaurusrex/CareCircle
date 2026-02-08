// models/HealthcareFacility.js
const mongoose = require("mongoose");

const healthcareFacilitySchema = new mongoose.Schema({
  name: String,
  type: {
    type: String, // clinic, hospital, phc
    enum: ["clinic", "hospital", "phc"]
  },
  address: String,
  latitude: Number,
  longitude: Number
});

module.exports = mongoose.model(
  "HealthcareFacility",
  healthcareFacilitySchema
);