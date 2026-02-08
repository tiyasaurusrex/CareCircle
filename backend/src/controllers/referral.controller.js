// import { referralAdvice } from "../services/referral.service.js";


// export const getReferralAdvice = (req, res) => {
// const result = referralAdvice(req.body.severity);
// res.json({ success: true, data: result });
// };
// controllers/referral.controller.js
const axios = require("axios");
const HealthcareFacility = require("../models/HealthcareFacility");
const distance = require("../utils/distance");

exports.getReferral = async (req, res) => {
  const { lat, lng, severity } = req.query;

  // Decide type based on severity
  const facilityType =
    severity === "severe" ? "hospital" : "clinic";

  // TRY ONLINE FIRST
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${lat},${lng}`,
          radius: 5000,
          type: facilityType,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    );

    if (response.data.results.length > 0) {
      const place = response.data.results[0];

      return res.json({
        mode: "online",
        facility: {
          name: place.name,
          address: place.vicinity,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng
        }
      });
    }
  } catch (err) {
    console.log("Google API failed, falling back to offline DB");
  }

  // OFFLINE FALLBACK
  const facilities = await HealthcareFacility.find({
    type: facilityType
  });

  let nearest = null;
  let minDist = Infinity;

  facilities.forEach(f => {
    const d = distance(
      lat,
      lng,
      f.latitude,
      f.longitude
    );
    if (d < minDist) {
      minDist = d;
      nearest = f;
    }
  });

  res.json({
    mode: "offline",
    facility: nearest
  });
};