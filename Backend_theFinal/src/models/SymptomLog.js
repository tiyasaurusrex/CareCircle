import mongoose from "mongoose";


const SymptomLogSchema = new mongoose.Schema({
patient: {
type: mongoose.Schema.Types.ObjectId,
ref: "Patient",
required: true
},
painLevel: {
type: Number,
required: true,
min: 1,
max: 10
},
temperature: {
type: Number,
required: true,
min: 34,
max: 43
},
notes: {
type: String,
trim: true
},
createdAt: {
type: Date,
default: Date.now
}
});


export default mongoose.model("SymptomLog", SymptomLogSchema);