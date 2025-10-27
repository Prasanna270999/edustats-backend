import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

// GET all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
