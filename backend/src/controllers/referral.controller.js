import { referralAdvice } from "../services/referral.service.js";


export const getReferralAdvice = (req, res) => {
const result = referralAdvice(req.body.severity);
res.json({ success: true, data: result });
};