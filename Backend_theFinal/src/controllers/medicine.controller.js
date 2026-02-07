import Medicine from "../models/Medicine.js";


export const addMedicine = async (req, res) => {
try {
const medicine = await Medicine.create({
patient: req.body.patientId,
name: req.body.name,
dosage: req.body.dosage,
schedule: req.body.schedule,
startDate: req.body.startDate,
endDate: req.body.endDate
});


res.json({ success: true, data: medicine });
} catch (err) {
res.status(400).json({ success: false, message: "Medicine add failed" });
}
};


export const getMedicinesByPatient = async (req, res) => {
const medicines = await Medicine.find({ patient: req.params.patientId });
res.json({ success: true, data: medicines });
};