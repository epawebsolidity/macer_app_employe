import express from "express";
import { claimAllowcationEmploye, createAllowcationEmploye, getAllowcationEmploye } from "../controllers/airdropControllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Route: GET employees (Protected Route)
router.post("/", verifyToken, createAllowcationEmploye);
router.get("/:id_employe", verifyToken, getAllowcationEmploye);
router.post("/reward", verifyToken, claimAllowcationEmploye)



export default router;
