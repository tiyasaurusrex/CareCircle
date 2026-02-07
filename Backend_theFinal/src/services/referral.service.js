export const referralAdvice = (severity) => {
    switch (severity) {
    case "severe":
    return {
    level: "emergency",
    advice: "Visit the nearest hospital immediately"
    };
    
    
    case "moderate":
    return {
    level: "primary",
    advice: "Consult a primary healthcare center"
    };
    
    
    default:
    return {
    level: "home",
    advice: "Continue home care and monitoring"
    };
    }
    };