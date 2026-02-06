import Symptom from '../models/Symptom.js';

/**
 * POST /api/symptoms
 * addSymptom
 */
export const addSymptom = async (req, res) => {
  try {
    const { patientId, painLevel, temperature, notes } = req.body;

    const symptom = await Symptom.create({
      patient: patientId,
      painLevel,
      temperature,
      notes,
      createdAt: new Date()
    });

    res.status(201).json(symptom);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add symptom' });
  }
};

/**
 * GET /api/symptoms/:patientId
 * getSymptoms
 */
export const getSymptoms = async (req, res) => {
  try {
    const symptoms = await Symptom.find({
      patient: req.params.patientId
    }).sort({ createdAt: -1 });

    res.json(symptoms);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch symptoms' });
  }
};