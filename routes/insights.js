import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

// Get performance insights
router.get("/", async (req, res) => {
  try {
    // Top scorer
    const topScorer = await Student.find().sort({ marks: -1 }).limit(1);

    // Low attendance (<75%)
    const lowAttendance = await Student.find({ attendance: { $lt: 75 } });

    // Average marks & attendance
    const avgData = await Student.aggregate([
      {
        $group: {
          _id: null,
          avgMarks: { $avg: "$marks" },
          avgAttendance: { $avg: "$attendance" }
        }
      }
    ]);

    // Rank students by marks
    const rankedStudents = await Student.find().sort({ marks: -1 });

    res.json({
      topScorer: topScorer[0] || null,
      lowAttendance,
      avgMarks: avgData[0]?.avgMarks || 0,
      avgAttendance: avgData[0]?.avgAttendance || 0,
      rankedStudents
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
