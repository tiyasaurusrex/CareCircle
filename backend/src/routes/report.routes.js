import express from "express";
import { generateReport } from "../controllers/report.controllers.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:patientId", protect, generateReport);

export default router;