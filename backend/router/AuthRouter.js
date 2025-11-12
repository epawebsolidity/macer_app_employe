import express from "express";
import { authController, checkAuthUsers, logoutController, refreshController } from "../controllers/authControllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", authController);
router.post("/refreshToken", refreshController);
router.post("/logout", logoutController);
router.get("/checkUsers", verifyToken, checkAuthUsers);


export default router;
