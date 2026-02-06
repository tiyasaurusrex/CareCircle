import Medicine from '../models/Medicine.js';
import MedicineLog from '../models/MedicineLog.js';
import { sendSMS } from '../services/sms.service.js';

/**
 * POST /api/medicines
 * addMedicine
 */
export const addMedicine = async (req, res) => {
  try {
    const { patientId, name, dosage, schedule, startDate, endDate } = req.body;
    const medicine = await Medicine.create({
      patient: patientId,
      name,
      dosage,
      schedule,
      startDate,
      endDate
    });

    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add medicine' });
  }
};

/**
 * GET /api/medicines/:patientId
 * getMedicinesByPatient
 */
export const getMedicinesByPatient = async (req, res) => {
  try {
    const medicines = await Medicine.find({
      patient: req.params.patientId
    });

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch medicines' });
  }
};

/**
 * POST /api/medicines/log
 * logMedicine
 */
export const logMedicine = async (req, res) => {
  try {
    const { medicineId, status,patientPhone } = req.body;

    const log = await MedicineLog.create({
      medicine: medicineId,
      date: new Date(),
      status
    });
    if (status === 'missed') {
        await sendSMS(
          patientPhone,
          'Reminder: You missed your scheduled medicine. Please take it as advised.'
        );
    }

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: 'Failed to log medicine' });
  }
};

