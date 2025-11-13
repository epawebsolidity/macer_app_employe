import express from "express";
import { createWallet, getWalletByUserId } from "../controllers/walletControllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Route: GET employees (Protected Route)
router.get("/", verifyToken, getWalletByUserId);
router.post("/", verifyToken, createWallet);

export default router;
