import { Router } from "express";
import authRouter from "./auth/index.route";
import contactRouter from "./contact/index.route";
import chatRouter from "./chat/index.route";

const router = Router();

// 模块路由挂载
router.use("/auth", authRouter);
router.use("/contact", contactRouter);
router.use("/chat", chatRouter);

export default router;
