const router = require('express').Router();
const multer = require('multer');
const csv = require('csvtojson');
const Student = require('../models/Student');

// Setup multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload CSV
// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (err) {
        console.error("Error fetching students:", err);  // <- add this
        res.status(500).json({ error: "Server error fetching students" });
    }
});

router.get('/', async (req, res) => {
    try {
        const students = await Student.find(); // fetch all students from DB
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded ❌' });

        const csvStr = req.file.buffer.toString();
        const students = await csv().fromString(csvStr);

        // Save each student in DB
        await Student.insertMany(students);

        res.status(200).json({ message: 'CSV uploaded successfully ✅' });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
