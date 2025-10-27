import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  rollNo: { type: Number, required: true },
  name: { type: String, required: true },
  marks: { type: Number, required: true },
  attendance: { type: Number, required: true }
});

// "students" must match your collection name in Compass
const Student = mongoose.model("Student", studentSchema, "students");

export default Student;
