import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { judgeGithub, judgeChess } from "../controllers/judgeController.js";

const router = express.Router();

router.get("/github", verifyToken, judgeGithub);

router.post("/chess", judgeChess);

export default router;
