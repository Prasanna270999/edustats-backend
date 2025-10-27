import mongoose from "mongoose";
import Student from "./models/Student.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const students = [
  { name: "John Doe", marks: 90 },
  { name: "Alice Smith", marks: 85 },
  { name: "Bob Johnson", marks: 78 }
];

const insertStudents = async () => {
  try {
    await Student.insertMany(students);
    console.log("Students inserted successfully ✅");
    mongoose.disconnect();
  } catch (err) {
    console.log(err);
  }
};

insertStudents();
