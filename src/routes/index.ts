import { Router } from "express";
import authRouter from "./auth/index.route";
import contactRouter from "./contact/index.route";
import chatRouter from "./chat/index.route";
import uploadRouter from "./upload/index";

const router = Router();

// 模块路由挂载
router.use("/auth", authRouter);
router.use("/contact", contactRouter);
router.use("/chat", chatRouter);
router.use("/upload", uploadRouter);

export default router;
