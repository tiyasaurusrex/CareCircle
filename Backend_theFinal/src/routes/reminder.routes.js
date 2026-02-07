import express from "express";
import {
createReminder,
getRemindersByPatient
} from "../controllers/reminder.controller.js";


const router = express.Router();


router.post("/reminders", createReminder);
router.get("/reminders/:patientId", getRemindersByPatient);


export default router;