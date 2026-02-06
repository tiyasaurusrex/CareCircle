import PDFDocument from 'pdfkit';
import Medicine from '../models/Medicine.js';
import MedicineLog from '../models/MedicineLog.js';
import Symptom from '../models/Symptom.js';

/**
 * GET /api/report/:patientId
 * generateReport
 */
export const generateReport = async (req, res) => {
  try {
    const { patientId } = req.params;

    const medicines = await Medicine.find({ patient: patientId });
    const logs = await MedicineLog.find().populate('medicine');
    const symptoms = await Symptom.find({ patient: patientId });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=recovery-report.pdf'
    );

    doc.pipe(res);

    doc.fontSize(18).text('CareCircle Recovery Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text('Medicines');
    medicines.forEach(m =>
      doc.text(`- ${m.name} (${m.dosage})`)
    );

    doc.moveDown();
    doc.fontSize(14).text('Medicine Logs');
    logs.forEach(l =>
      doc.text(`${l.medicine.name}: ${l.status}`)
    );

    doc.moveDown();
    doc.fontSize(14).text('Symptoms');
    symptoms.forEach(s =>
      doc.text(
        `Pain: ${s.painLevel}, Temp: ${s.temperature}, Notes: ${s.notes}`
      )
    );

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate report' });
  }
};