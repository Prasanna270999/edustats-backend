import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import studentRoutes from "./routes/students.js";
import app from "./app.js";




dotenv.config();

const app = express();
app.use(express.json());

// ✅ Use public student route
app.use("/api/students", studentRoutes);

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get("/", (req, res) => {
  res.send("🎉 EduStats Backend is Live and Running!");
});
