import mongoose from "mongoose";
import Performance from "../models/Performance.js";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";

// GET /api/insights?class=10&section=A
export async function getClassInsights(req, res) {
  const className = req.query.class;
  const section = req.query.section;

  try {
    // 1) top scorer per subject (latest exam performance not strictly latest date but highest marks)
    const topBySubject = await Performance.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: "$student" },
      { $match: { "student.class": className, ...(section ? { "student.section": section } : {}) } },
      { $group: { _id: "$subject", topMark: { $max: "$marks" } } },
      {
        $lookup: {
          from: "performances",
          let: { subj: "$_id", tm: "$topMark" },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ["$subject", "$$subj"] }, { $eq: ["$marks", "$$tm"] }] } } },
            { $limit: 1 }
          ],
          as: "topPerf"
        }
      },
      { $unwind: "$topPerf" },
      {
        $lookup: {
          from: "students",
          localField: "topPerf.studentId",
          foreignField: "_id",
          as: "topStudent"
        }
      },
      { $unwind: "$topStudent" },
      { $project: { subject: "$_id", topMark: 1, topStudent: { name: "$topStudent.name", _id: "$topStudent._id", rollNo: "$topStudent.rollNo" }, _id: 0 } }
    ]);

    // 2) low attendance students (<75%)
    const lowAttendance = await Attendance.aggregate([
      {
        $lookup: { from: "students", localField: "studentId", foreignField: "_id", as: "student" }
      },
      { $unwind: "$student" },
      { $match: { "student.class": className, ...(section ? { "student.section": section } : {}) } },
      {
        $group: {
          _id: "$studentId",
          totalDays: { $sum: 1 },
          presentDays: { $sum: { $cond: ["$present", 1, 0] } },
          student: { $first: "$student" }
        }
      },
      {
        $project: {
          student: { name: "$student.name", _id: "$student._id", rollNo: "$student.rollNo" },
          attendancePct: { $cond: [{ $eq: ["$totalDays", 0] }, 0, { $multiply: [{ $divide: ["$presentDays", "$totalDays"] }, 100] }] }
        }
      },
      { $match: { attendancePct: { $lt: 75 } } },
      { $sort: { attendancePct: 1 } }
    ]);

    return res.json({ topBySubject, lowAttendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
