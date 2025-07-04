import { Router } from "express";
import authRouter from "./auth/index.route";

const router = Router();

// 模块路由挂载
router.use("/auth", authRouter);

export default router;
