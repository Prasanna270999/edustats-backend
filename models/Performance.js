import mongoose from "mongoose";

const PerformanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  subject: { type: String, required: true },
  marks: { type: Number, required: true },
  totalMarks: { type: Number, default: 100 },
  examDate: { type: Date, default: Date.now },
  type: { type: String, default: "unit" } // unit, midterm, final ...
});

PerformanceSchema.index({ studentId: 1 });
PerformanceSchema.index({ subject: 1, examDate: -1 });

export default mongoose.model("Performance", PerformanceSchema);
