import express from "express";
import {
createPatient,
getPatientById,
getPatients
} from "../controllers/patient.controller.js";


const router = express.Router();


router.post("/patients", createPatient);
router.get("/patients/:patientId", getPatientById);
router.get("/patients", getPatients);


export default router;