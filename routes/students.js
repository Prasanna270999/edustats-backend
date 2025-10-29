import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

// ✅ GET all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    console.log("✅ Students fetched:", students);
    res.status(200).json(students);
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

