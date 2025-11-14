import express from "express";
import { createWallet, deleteWalletUsers, getWalletByUserId } from "../controllers/walletControllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Route: GET employees (Protected Route)
router.get("/:id_users", verifyToken, getWalletByUserId);
router.post("/", verifyToken, createWallet);
router.delete("/:id_users", verifyToken, deleteWalletUsers);

export default router;
