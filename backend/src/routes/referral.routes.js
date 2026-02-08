import express from "express";
import { getReferral } from "../controllers/referral.controller.js";

const router = express.Router();

router.post("/referral", getReferral);

export default router;
