import express from "express";
import {
addMedicine,
getMedicinesByPatient
} from "../controllers/medicine.controller.js";


const router = express.Router();


router.post("/medicines", addMedicine);
router.get("/medicines/:patientId", getMedicinesByPatient);


export default router;