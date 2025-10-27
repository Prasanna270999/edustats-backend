import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  date: { type: Date, required: true },
  present: { type: Boolean, required: true }
});

AttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", AttendanceSchema);
