import express from "express";
import {
  addMedicine,
  getMedicinesByPatient,
  logMedicine,
} from "../controllers/medicine.controllers.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// add medicine
router.post("/", protect, addMedicine);

// list medicines for a patient
router.get("/:patientId", protect, getMedicinesByPatient);

// log taken / missed
router.post("/log", protect, logMedicine);

export default router;