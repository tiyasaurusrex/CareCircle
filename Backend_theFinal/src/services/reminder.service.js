export const buildReminder = (medicine) => {
    return {
    reminderTimes: medicine.schedule,
    frequency: "daily",
    active: true
    };
};