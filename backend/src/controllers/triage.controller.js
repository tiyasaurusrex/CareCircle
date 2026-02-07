import { runTriageLogic } from "../services/triage.service.js";


export const runTriage = (req, res) => {
const result = runTriageLogic(req.body);
res.json({ success: true, data: result });
};