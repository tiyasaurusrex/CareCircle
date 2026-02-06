import Patient from '../models/Patient.js';

/**
 * POST /api/patients
 * Create a new patient
 */
export const createPatient = async (req, res) => {
  try {
    const { name, age, condition } = req.body;

    if (!name || !age || !condition) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const patient = new Patient({
      name,
      age,
      condition,
      caregivers: [req.user.id],   // creator becomes caregiver
      createdBy: req.user.id
    });

    await patient.save();

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create patient' });
  }
};

/**
 * GET /api/patients
 * Get all patients for logged-in user
 */
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({
      $or: [
        { createdBy: req.user.id },
        { caregivers: req.user.id }
      ]
    });

    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch patients' });
  }
};