import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true, unique: true },
  name: String,
  email: String,
  photoURL: String,
  role: {
    type: String,
    default: "user"
  },
 
  age: Number,
  gender: { type: String, enum: ["male", "female", "other"] },
  condition: String,
  caregiverPhone: String,
  profileComplete: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
