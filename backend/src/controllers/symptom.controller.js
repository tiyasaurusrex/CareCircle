import SymptomLog from "../models/SymptomLog.js";


export const logSymptom = async (req, res) => {
try {
const log = await SymptomLog.create({
patient: req.body.patientId,
painLevel: req.body.painLevel,
temperature: req.body.temperature,
notes: req.body.notes
});


res.json({ success: true, data: log });
} catch (err) {
res.status(400).json({ success: false, message: "Symptom logging failed" });
}
};


export const getSymptomsByPatient = async (req, res) => {
const symptoms = await SymptomLog.find({ patient: req.params.patientId });
res.json({ success: true, data: symptoms });
};