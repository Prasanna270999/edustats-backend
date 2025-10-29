import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import studentRoutes from "./routes/students.js"; // or your routes file

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Your routes
app.use("/students", studentRoutes);

// Export app to use in server.js
export default app;
