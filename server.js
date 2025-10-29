import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import studentRoutes from "./routes/students.js"; // ✅ only students route

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors({
  origin: ["http://localhost:3000", "https://<your-vercel-domain>.vercel.app"], // add when known
  credentials: true,

}));
app.use(express.json());

// ✅ Routes
app.use("/api/students", studentRoutes);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

mongoose.connection.once("open", () => {
  console.log("✅ Connected to database:", mongoose.connection.name);
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

app.get("/", (req, res) => res.send("EduStats backend running"));



