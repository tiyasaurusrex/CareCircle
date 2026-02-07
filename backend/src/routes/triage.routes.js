import express from "express";
import { runTriage } from "../controllers/triage.controller.js";


const router = express.Router();


router.post("/triage", runTriage);


export default router;