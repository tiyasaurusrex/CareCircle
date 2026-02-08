
// scripts/seedFacilities.js
const HealthcareFacility = require("../models/HealthcareFacility");

await HealthcareFacility.create([
  {
    name: "Primary Health Center Andheri",
    type: "phc",
    address: "Andheri East, Mumbai",
    latitude: 19.1136,
    longitude: 72.8697
  },
  {
    name: "JJ Hospital",
    type: "hospital",
    address: "Byculla, Mumbai",
    latitude: 18.975,
    longitude: 72.829
  }
]);
