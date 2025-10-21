const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

mongoose.connect("mongodb://localhost:27017/edustats")
  .then(async () => {
    const hashed = await bcrypt.hash("Admin123", 10);
    const user = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: hashed
    });
    await user.save();
    console.log("✅ Dummy user created: admin@example.com / Admin123");
    mongoose.disconnect();
  })
  .catch(err => console.error("DB error:", err));
