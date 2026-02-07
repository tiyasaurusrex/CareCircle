import Patient from "../models/Patient.js";


export const createPatient = async (req, res) => {
try {
const patient = await Patient.create(req.body);
res.json({ success: true, data: patient });
} catch (err) {
res.status(400).json({ success: false, message: "Patient creation failed" });
}
};


export const getPatientById = async (req, res) => {
try {
const patient = await Patient.findById(req.params.patientId);
res.json({ success: true, data: patient });
} catch (err) {
res.status(404).json({ success: false, message: "Patient not found" });
}
};


export const getPatients = async (req, res) => {
const patients = await Patient.find();
res.json({ success: true, data: patients });
};