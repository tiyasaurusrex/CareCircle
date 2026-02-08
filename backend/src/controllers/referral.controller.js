import axios from "axios";
import HealthcareFacility from "../models/HealthcareFacility.js";
import distance from "../utils/distance.js";

export const getReferral = async (req, res) => {
  const { lat, lng, severity } = req.query;

  const facilityType =
    severity === "severe" ? "hospital" : "clinic";

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${lat},${lng}`,
          radius: 5000,
          type: facilityType,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
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
          longitude: place.geometry.location.lng,
        },
      });
    }
  } catch (err) {
    console.log("Google API failed, falling back to offline DB");
  }

  const facilities = await HealthcareFacility.find({
    type: facilityType,
  });

  let nearest = null;
  let minDist = Infinity;

  facilities.forEach((f) => {
    const d = distance(lat, lng, f.latitude, f.longitude);
    if (d < minDist) {
      minDist = d;
      nearest = f;
    }
  });

  res.json({
    mode: "offline",
    facility: nearest,
  });
};
