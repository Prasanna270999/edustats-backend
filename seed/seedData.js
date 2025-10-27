import mongoose from "mongoose";
import Student from "../models/Student.js";
import Performance from "../models/Performance.js";
import Attendance from "../models/Attendance.js";
import dotenv from "dotenv";
dotenv.config();

async function run(){
  await mongoose.connect(process.env.MONGO_URL);
  await Student.deleteMany({});
  await Performance.deleteMany({});
  await Attendance.deleteMany({});

  const s1 = await Student.create({ name: "Alice", class: "10", section: "A", rollNo: 1 });
  const s2 = await Student.create({ name: "Bob", class: "10", section: "A", rollNo: 2 });
  const s3 = await Student.create({ name: "Charlie", class: "10", section: "A", rollNo: 3 });

  await Performance.insertMany([
    { studentId: s1._id, subject: "Maths", marks: 92, totalMarks: 100, examDate: new Date("2025-09-01"), type: "unit1" },
    { studentId: s2._id, subject: "Maths", marks: 78, totalMarks: 100, examDate: new Date("2025-09-01"), type: "unit1" },
    { studentId: s3._id, subject: "Maths", marks: 40, totalMarks: 100, examDate: new Date("2025-09-01"), type: "unit1" },
    { studentId: s1._id, subject: "Science", marks: 85, totalMarks: 100, examDate: new Date("2025-09-02"), type: "unit1" },
    { studentId: s2._id, subject: "Science", marks: 65, totalMarks: 100, examDate: new Date("2025-09-02"), type: "unit1" }
  ]);

  // attendance: Alice good, Bob medium, Charlie low
  const today = new Date();
  const dates = [...Array(20)].map((_,i) => new Date(Date.now() - i*24*60*60*1000));
  for (const d of dates) {
    await Attendance.create({ studentId: s1._id, date: d, present: Math.random() > 0.05 });
    await Attendance.create({ studentId: s2._id, date: d, present: Math.random() > 0.3 });
    await Attendance.create({ studentId: s3._id, date: d, present: Math.random() > 0.6 }); // low
  }

  console.log("Seed done");
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
