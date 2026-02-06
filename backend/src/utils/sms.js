// services/sms.service.js

exports.sendSMS = async (phoneNumber, message) => {
    // MOCK SMS SERVICE (can be replaced with Twilio/Fast2SMS)
    console.log("📩 Sending SMS");
    console.log("To:", phoneNumber);
    console.log("Message:", message);
  
    return true;
};