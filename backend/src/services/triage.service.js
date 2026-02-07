export const runTriageLogic = ({ painLevel, temperature }) => {
    let severity = "mild";
    let advice = "Home care is sufficient";
    let referralRequired = false;
    
    
    if (painLevel >= 8 || temperature >= 39) {
    severity = "severe";
    advice = "Seek immediate medical attention";
    referralRequired = true;
    } else if (painLevel >= 4 || temperature >= 38) {
    severity = "moderate";
    advice = "Monitor symptoms and consult a doctor";
    }
    
    
    return { severity, advice, referralRequired };
    };