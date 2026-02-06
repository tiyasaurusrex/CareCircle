// controllers/sync.controller.js

const Symptom = require("../models/Symptom");
const MedicineLog = require("../models/MedicineLog");

exports.syncOfflineData = async (req, res) => {
  try {
    const { patientId, symptoms, medicineLogs } = req.body;

    // Save symptoms
    if (symptoms && symptoms.length > 0) {
      for (let s of symptoms) {
        await Symptom.create({
          patient: patientId,
          description: s.description,
          severity: s.severity,
          createdAt: s.createdAt
        });
      }
    }

    // Save medicine adherence logs
    if (medicineLogs && medicineLogs.length > 0) {
      for (let m of medicineLogs) {
        await MedicineLog.create({
          patient: patientId,
          medicine: m.medicine,
          taken: m.taken,
          date: m.date
        });
      }
    }

    res.status(200).json({
      message: "Offline data synced successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Sync failed",
      error: error.message
    });
  }
};