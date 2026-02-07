import express from "express";
import { getReferralAdvice } from "../controllers/referral.controller.js";


const router = express.Router();


router.post("/referral", getReferralAdvice);


export default router;