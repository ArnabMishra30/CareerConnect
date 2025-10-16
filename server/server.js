// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors'
import "./models/User.js";
import "./models/Job.js";
import "./models/Application.js";
import authRoutes from "./routes/authRoute.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicatonRoutes.js";

dotenv.config();
const app = express();
app.use(cookieParser());
// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",                   
    "https://career-connect-tau.vercel.app/"
  ],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

const PORT = process.env.PORT || 5000;

// DB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error: ", err));

//creating a demo request in the server..
app.get('/', (req, res) => {
  res.send("Hello Aict..")
})