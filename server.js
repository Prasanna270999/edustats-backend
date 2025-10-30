import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import studentRoutes from "./routes/students.js";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ CORS Setup – allow your frontend domains
app.use(
  cors({
    origin: [
      "https://edustats-frontend.vercel.app", // your deployed frontend
      "https://edustats-frontend-git-main-prasanna9s-projects.vercel.app", // optional vercel preview URL
      "http://localhost:3000", // local testing
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    mongoose.connection.once("open", () => {
      console.log("✅ Connected to database:", mongoose.connection.name);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ API Routes
app.use("/api/students", studentRoutes);

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("EduStats backend running ✅");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));




