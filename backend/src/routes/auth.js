import express from "express";
import admin from "../config/firebase.js";
import User from "../models/User.js";

const router = express.Router();
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(token);

    const { uid, name, email, picture } = decodedToken;
    let user = await User.findOne({ firebaseUID: uid });
    if (!user) {
      user = await User.create({
        firebaseUID: uid,
        name,
        email,
        photoURL: picture,
      });
    }

    res.json({
      message: "User authenticated",
      user,
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

router.put("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const { name, age, gender, condition, caregiverPhone } = req.body;

    const updatePayload = {
      name: typeof name === "string" ? name.trim() : name,
      age: typeof age === "number" ? age : Number(age),
      gender,
      condition: typeof condition === "string" ? condition.trim() : condition,
      caregiverPhone: typeof caregiverPhone === "string" ? caregiverPhone.trim() : caregiverPhone,
      email: decodedToken.email,
      profileComplete: true,
    };

    const user = await User.findOneAndUpdate(
      { firebaseUID: decodedToken.uid },
      { $set: updatePayload, $setOnInsert: { firebaseUID: decodedToken.uid } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, data: user });
  } catch (error) {
    if (error?.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid profile data" });
    }
    res.status(500).json({ error: "Profile update failed" });
  }
});

router.delete("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    const user = await User.findOneAndDelete({ firebaseUID: decodedToken.uid });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, message: "Profile deleted" });
  } catch (error) {
    res.status(500).json({ error: "Profile deletion failed" });
  }
});

export default router;
