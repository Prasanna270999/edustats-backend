const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// POST /api/upload
router.post("/", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ ok: false, message: "No file uploaded" });
    res.json({ ok: true, message: "File uploaded successfully" });
});

module.exports = router;
