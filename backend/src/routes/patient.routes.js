import express from "express";
import {
  createPatient,
  getPatients,
} from "../controllers/patient.controllers.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createPatient);
router.get("/", protect, getPatients);

export default router;