const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET /api/stats
router.get('/', async (req, res) => {
  try {
    const students = await Student.find({});
    const totalStudents = students.length;

    if (totalStudents === 0) {
      return res.json({
        totalStudents: 0,
        avgAttendance: 0,
        totalClasses: 0,
        belowThresholdCount: 0,
        distribution: { '0-40':0, '41-60':0, '61-80':0, '81-100':0 },
        belowThresholdList: [],
      });
    }

    let sumAttendance = 0;
    let maxTotalClasses = 0;
    const distribution = { '0-40':0, '41-60':0, '61-80':0, '81-100':0 };
    const threshold = Number(req.query.threshold) || 75;
    const belowThresholdList = [];

    students.forEach(s => {
      const perc = typeof s.attendancePercentage === 'number'
        ? s.attendancePercentage
        : (s.totalClasses ? (s.attendanceCount / s.totalClasses) * 100 : 0);

      sumAttendance += perc;
      if (s.totalClasses > maxTotalClasses) maxTotalClasses = s.totalClasses;

      if (perc <= 40) distribution['0-40']++;
      else if (perc <= 60) distribution['41-60']++;
      else if (perc <= 80) distribution['61-80']++;
      else distribution['81-100']++;

      if (perc < threshold) {
        belowThresholdList.push({
          name: s.name,
          roll: s.roll,
          attendancePercentage: Math.round(perc * 100) / 100
        });
      }
    });

    const avgAttendance = Math.round((sumAttendance / totalStudents) * 100) / 100;

    res.json({
      totalStudents,
      avgAttendance,
      totalClasses: maxTotalClasses,
      belowThresholdCount: belowThresholdList.length,
      distribution,
      belowThresholdList,
      threshold
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
