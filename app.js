import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import studentRouter from "./routes/students.js";
import insightsRouter from "./routes/insights.js";

dotenv.config();
const app = express();

app.use(cors()); // ⚠️ Add CORS first
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// Routes
app.use("/students", studentRouter);
app.use("/insights", insightsRouter);

// Root route
app.get("/", (req, res) => res.send("Backend is running"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
