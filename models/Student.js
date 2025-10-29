import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  rollNo: Number,
  name: String,
  marks: Number,
  attendance: Number,
});

// ✅ explicitly use the "students" collection from your database
const Student = mongoose.model("Student", studentSchema, "students");

export default Student;

