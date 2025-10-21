const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Student = require("../models/Student");

router.get("/attendance", auth, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
