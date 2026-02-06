// controllers/triage.controller.js

exports.runTriage = (req, res) => {
    const { symptom, severity } = req.body;
  
    let response = {
      advice: "Monitor your symptoms",
      urgency: "low",
      referral: "None"
    };
  
    // BASIC TRIAGE RULES
    if (symptom === "fever" && severity === "high") {
      response = {
        advice: "Visit a nearby Primary Health Center within 24 hours.",
        urgency: "medium",
        referral: "Primary Health Center"
      };
    }
  
    if (symptom === "chest pain") {
      response = {
        advice: "Seek emergency medical care immediately.",
        urgency: "high",
        referral: "District Hospital"
      };
    }
  
    if (symptom === "headache" && severity === "low") {
      response = {
        advice: "Rest, stay hydrated, and monitor symptoms.",
        urgency: "low",
        referral: "None"
      };
    }
  
    return res.status(200).json(response);
  };