import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js"; // make sure the path is correct to your User model

// Connect to your MongoDB
mongoose.connect("mongodb://localhost:27017/edustats") // replace with your MONGO_URL if using .env
  .then(async () => {
    // Find the user you want to reset
    const user = await User.findOne({ email: "test2@example.com" });

    if (!user) {
      console.log("User not found!");
      mongoose.connection.close();
      return;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash("mypassword123", salt);

    // Save changes
    await user.save();
    console.log("Password reset successful!");

    mongoose.connection.close();
  })
  .catch(err => console.error(err));
