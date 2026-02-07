import express from "express";
import {
logSymptom,
getSymptomsByPatient
} from "../controllers/symptom.controller.js";


const router = express.Router();


router.post("/symptoms", logSymptom);
router.get("/symptoms/:patientId", getSymptomsByPatient);


export default router;