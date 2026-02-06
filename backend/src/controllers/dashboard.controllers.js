import Medicine from '../models/Medicine.js';
import MedicineLog from '../models/MedicineLog.js';
import Symptom from '../models/Symptom.js';

/**
 * GET /api/dashboard/:patientId
 * getDashboardData
 */
export const getDashboardData = async (req, res) => {
  try {
    const { patientId } = req.params;

    
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Today's medicines
    const medicines = await Medicine.find({
      patient: patientId,
      startDate: { $lte: today },
      endDate: { $gte: today }
    });

    
    // logs only for today
    const logs = await MedicineLog.find({ // takes all the entries where date is of today
        date: { $gte: startOfDay, $lte: endOfDay }
    }).populate({ //  before populte medicine: 123 after that all details of medinide are stored
        path: 'medicine',
        match: { patient: patientId }// match basically makes makes medicine==null werever patient id doesnt match
    });
    
    const validLogs = logs.filter(l => l.medicine);// clears all the objects where medicine :null
    const takenCount = logs.filter(l => l.status === 'taken').length;
    const missedCount = logs.filter(l => l.status === 'missed').length;

    const adherence =
      medicines.length === 0
        ? 100
        : Math.round((takenCount / medicines.length) * 100);

    const recentSymptoms = await Symptom.find({ patient: patientId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      todayMedicines: medicines,
      adherence,
      missedCount,
      recentSymptoms
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load dashboard' });
  }
};