const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../middleware/verifyToken'); // adjust if your JWT middleware has a different name

// Import your existing models
const Student = require('../models/Student');      // or Performance model if you created one
const Attendance = require('../models/Attendance'); // adjust paths/names to match your Task 1 setup

// 📊 Dashboard route
router.get('/', verifyToken, async (req, res) => {
  try {
    const { class: cls, section, subject, from, to, type } = req.query;

    // --- Common match filter ---
    const match = {};
    if (cls) match.class = cls;
    if (section) match.section = section;
    if (subject) match.subject = subject;
    if (from || to) {
      match.date = {};
      if (from) match.date.$gte = new Date(from);
      if (to) match.date.$lte = new Date(to);
    }

    // --- Handle each type ---
    if (type === 'marks') {
      // Example: group by mark ranges
      const data = await Student.aggregate([
        { $match: match },
        {
          $bucket: {
            groupBy: "$marks",
            boundaries: [0, 21, 41, 61, 81, 101],
            default: "Other",
            output: { count: { $sum: 1 } }
          }
        },
        { $project: { _id: 0, range: "$_id", count: 1 } }
      ]);
      return res.json({ ok: true, data });
    }

    if (type === 'attendance') {
      const data = await Attendance.aggregate([
        { $match: match },
        {
          $project: {
            month: { $dateToString: { format: "%Y-%m", date: "$date" } },
            present: 1
          }
        },
        {
          $group: {
            _id: "$month",
            attendancePercent: { $avg: { $cond: ["$present", 1, 0] } }
          }
        },
        { $sort: { _id: 1 } }
      ]);
      return res.json({ ok: true, data });
    }

    if (type === 'classAvg') {
      const data = await Student.aggregate([
        { $match: match },
        { $group: { _id: "$subject", avgMarks: { $avg: "$marks" } } },
        { $sort: { _id: 1 } }
      ]);
      return res.json({ ok: true, data });
    }

    return res.status(400).json({ ok: false, message: 'Invalid chart type' });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ ok: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
