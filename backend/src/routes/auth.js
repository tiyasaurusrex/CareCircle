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
    const decodedToken = await admin.auth().verifyIdToken(token);

    const { name, age, gender, condition, caregiverPhone } = req.body;

    const user = await User.findOneAndUpdate(
      { firebaseUID: decodedToken.uid },
      {
        name,
        age,
        gender,
        condition,
        caregiverPhone,
        profileComplete: true,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: "Profile update failed" });
  }
});

export default router;
