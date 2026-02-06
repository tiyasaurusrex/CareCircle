import express from "express";
import {
  addSymptom,
  getSymptoms,
} from "../controllers/symptom.controllers.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, addSymptom);
router.get("/:patientId", protect, getSymptoms);

export default router;