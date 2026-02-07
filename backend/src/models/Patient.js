import mongoose from "mongoose";


const PatientSchema = new mongoose.Schema({
name: {
type: String,
required: true,
trim: true
},
age: {
type: Number,
required: true,
min: 0,
max: 120
},
gender: {
type: String,
required: true,
enum: ["male", "female", "other"]
},
condition: {
type: String,
default: ""
},
caregiverPhone:{
    type: String,
    required:true,
    unique:true,
    match: [/^[6-9]\d{9}$/, "Invalid phone number"],
},
createdAt: {
type: Date,
default: Date.now
}
});


export default mongoose.model("Patient", PatientSchema);