import express from "express";
import { getEmployees } from "../controllers/employeeController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Route: GET employees (Protected Route)
router.get("/", verifyToken, getEmployees);

export default router;
