import Reminder from "../models/Reminder.js";
import Medicine from "../models/Medicine.js";
import { buildReminder } from "../services/reminder.service.js";


export const createReminder = async (req, res) => {
try {
const medicine = await Medicine.findById(req.body.medicineId);
const reminderData = buildReminder(medicine);


const reminder = await Reminder.create({
patient: req.body.patientId,
medicine: medicine._id,
...reminderData
});


res.json({ success: true, data: reminder });
} catch (err) {
res.status(400).json({ success: false, message: "Reminder creation failed" });
}
};


export const getRemindersByPatient = async (req, res) => {
const reminders = await Reminder.find({ patient: req.params.patientId });
res.json({ success: true, data: reminders });
};