import express from "express";
import { getDashboardData } from "../controllers/dashboard.controllers.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:patientId", protect, getDashboardData);

export default router;