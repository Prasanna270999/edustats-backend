const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    marks: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
