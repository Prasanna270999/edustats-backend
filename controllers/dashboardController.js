import mongoose from "mongoose";
import Student from "../models/Student.js";
import Performance from "../models/Performance.js";
import Attendance from "../models/Attendance.js";

// GET /api/students/:id/dashboard
export async function getStudentDashboard(req, res) {
  const studentId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(studentId))
    return res.status(400).json({ error: "Invalid student id" });

  try {
    const student = await Student.findById(studentId).lean();
    if (!student) return res.status(404).json({ error: "Student not found" });

    // marks by subject (avg)
    const marksBySubject = await Performance.aggregate([
      { $match: { studentId: mongoose.Types.ObjectId(studentId) } },
      { $group: { _id: "$subject", avgMarks: { $avg: "$marks" }, attempts: { $sum: 1 } } },
      { $project: { subject: "$_id", avgMarks: 1, attempts: 1, _id: 0 } }
    ]);

    // overall avg & total exams
    const overallAgg = await Performance.aggregate([
      { $match: { studentId: mongoose.Types.ObjectId(studentId) } },
      { $group: { _id: null, avgMarks: { $avg: "$marks" }, totalExams: { $sum: 1 } } },
      { $project: { _id: 0 } }
    ]);
    const overall = overallAgg[0] || { avgMarks: 0, totalExams: 0 };

    // attendance stats
    const attendanceAgg = await Attendance.aggregate([
      { $match: { studentId: mongoose.Types.ObjectId(studentId) } },
      {
        $group: {
          _id: null,
          totalDays: { $sum: 1 },
          presentDays: { $sum: { $cond: ["$present", 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          totalDays: 1,
          presentDays: 1,
          attendancePct: {
            $cond: [
              { $eq: ["$totalDays", 0] },
              0,
              { $multiply: [{ $divide: ["$presentDays", "$totalDays"] }, 100] }
            ]
          }
        }
      }
    ]);
    const attendance = attendanceAgg[0] || { totalDays: 0, presentDays: 0, attendancePct: 0 };

    // attendance trend (last 6 dates grouped by month)
    const attendanceTrendAgg = await Attendance.aggregate([
      { $match: { studentId: mongoose.Types.ObjectId(studentId) } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          total: { $sum: 1 },
          present: { $sum: { $cond: ["$present", 1, 0] } }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    const attendanceTrend = {
      dates: attendanceTrendAgg.map(item => `${item._id.year}-${String(item._id.month).padStart(2,"0")}`),
      values: attendanceTrendAgg.map(item => item.present / item.total * 100)
    };

    // rank in class by average marks
    const classAvgAgg = await Performance.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "studentRef"
        }
      },
      { $unwind: "$studentRef" },
      { $match: { "studentRef.class": student.class, "studentRef.section": student.section } },
      { $group: { _id: "$studentId", avgMarks: { $avg: "$marks" } } },
      { $sort: { avgMarks: -1 } }
    ]);
    let rank = null;
    for (let i = 0; i < classAvgAgg.length; i++) {
      if (String(classAvgAgg[i]._id) === String(studentId)) { rank = i + 1; break; }
    }

    // generate simple insights (a few rules)
    const insights = [];
    if (attendance.attendancePct < 75) {
      insights.push({ type: "attendance", priority: "high", message: `Attendance low: ${attendance.attendancePct.toFixed(1)}%` });
    }
    if (overall.avgMarks < 40 && overall.totalExams > 0) {
      insights.push({ type: "marks", priority: "high", message: `Low overall average: ${overall.avgMarks.toFixed(1)}` });
    }

    // compare to class average (compute class average)
    const classAgg = await Performance.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "studentRef"
        }
      },
      { $unwind: "$studentRef" },
      { $match: { "studentRef.class": student.class, "studentRef.section": student.section } },
      { $group: { _id: "$studentId", avgMarks: { $avg: "$marks" } } },
      { $group: { _id: null, classAvg: { $avg: "$avgMarks" } } }
    ]);
    const classAvg = classAgg[0] ? classAgg[0].classAvg : null;
    if (classAvg && (classAvg - overall.avgMarks) > 10) {
      insights.push({ type: "comparison", priority: "medium", message: `Below class average by ${(classAvg - overall.avgMarks).toFixed(1)} marks` });
    }

    return res.json({
      student,
      marksBySubject,
      overall,
      attendance,
      attendanceTrend,
      rank,
      insights
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
