const mongoose = require('mongoose');

const perfSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  subject: String,
  marks: Number,
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['exam','assignment','attendance'], default: 'exam' },
});

module.exports = mongoose.model('Performance', perfSchema);
