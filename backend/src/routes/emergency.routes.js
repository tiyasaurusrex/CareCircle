import express from "express";
import EmergencyEvent from "../models/EmergencyEvent.js";
import verifyFirebaseToken from "../middlewares/auth.middleware.js";

const router = express.Router();

// POST /api/emergency-events — save an SOS event
router.post("/emergency-events", verifyFirebaseToken, async (req, res) => {
  try {
    const event = await EmergencyEvent.create(req.body);
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to save emergency event" });
  }
});

// GET /api/emergency-events — list events for the authenticated user
router.get("/emergency-events", verifyFirebaseToken, async (req, res) => {
  try {
    const events = await EmergencyEvent.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch emergency events" });
  }
});

export default router;
