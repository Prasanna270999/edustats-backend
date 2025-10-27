import express from "express";
const router = express.Router();
import { getStudentDashboard } from "../controllers/dashboardController.js";

router.get("/:id/dashboard", getStudentDashboard);

export default router;
