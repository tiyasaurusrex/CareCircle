import mongoose from "mongoose";


const MedicineSchema = new mongoose.Schema({
patient: {
type: mongoose.Schema.Types.ObjectId,
ref: "Patient",
required: true
},
name: {
type: String,
required: true,
trim: true
},
dosage: {
type: String,
required: true
},
schedule: {
type: [String],
required: true,
validate: v => v.length > 0
},
startDate: {
type: Date,
required: true
},
endDate: {
type: Date,
required: true
}
});


export default mongoose.model("Medicine", MedicineSchema);