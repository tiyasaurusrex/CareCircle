import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import symptomRoutes from "./routes/symptom.routes.js";
import triageRoutes from "./routes/triage.routes.js";
import medicineRoutes from "./routes/medicine.routes.js";
import reminderRoutes from "./routes/reminder.routes.js";
import referralRoutes from "./routes/referral.routes.js";


const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error (server will continue):", err.message));


app.use("/api/auth", authRoutes);
app.use("/api", patientRoutes);
app.use("/api", symptomRoutes);
app.use("/api", triageRoutes);
app.use("/api", medicineRoutes);
app.use("/api", reminderRoutes);
app.use("/api", referralRoutes);


export default app;