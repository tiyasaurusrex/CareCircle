import mongoose from "mongoose";


const ReminderSchema = new mongoose.Schema({
patient: {
type: mongoose.Schema.Types.ObjectId,
ref: "Patient",
required: true
},
medicine: {
type: mongoose.Schema.Types.ObjectId,
ref: "Medicine",
required: true
},
reminderTimes: {
type: [String],
required: true
},
frequency: {
type: String,
enum: ["daily", "weekly"],
default: "daily"
},
active: {
type: Boolean,
default: true
}
});


export default mongoose.model("Reminder", ReminderSchema);