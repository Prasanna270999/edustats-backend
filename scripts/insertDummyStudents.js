const mongoose = require("mongoose");
const Student = require("../models/Student");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/edustats")
  .then(async () => {
    console.log("✅ MongoDB Connected");

    // Remove old data if needed
    await Student.deleteMany({});

    // Helper function to create attendance over several months
    const generateAttendance = (months = 6) => {
      const records = [];
      const today = new Date();
      for (let m = 0; m < months; m++) {
        for (let d = 1; d <= 20; d++) { // assume 20 class days per month
          const date = new Date(today.getFullYear(), today.getMonth() - m, d);
          const present = Math.random() > 0.2; // 80% present probability
          records.push({ date, present });
        }
      }
      return records;
    };

    // Example students
    const students = [
      { name: "Prasanna Kumar", rollNo: "ECE001", attendance: generateAttendance() },
      { name: "Aarav Singh", rollNo: "ECE002", attendance: generateAttendance() },
      { name: "Meera Nair", rollNo: "ECE003", attendance: generateAttendance() },
      { name: "Rohan Das", rollNo: "ECE004", attendance: generateAttendance() },
      { name: "Anjali Sharma", rollNo: "ECE005", attendance: generateAttendance() },
    ];

    await Student.insertMany(students);
    console.log("🎉 Dummy students inserted successfully!");
    mongoose.disconnect();
  })
  .catch(err => console.error("❌ MongoDB Error:", err));
