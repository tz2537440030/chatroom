import { Router } from "express";
import { login, register, sendVerifyCodeController } from "./index.controller";

const router = Router();

router.post("/register", register);
router.post("/send-verify-code", sendVerifyCodeController);
router.post("/login", login);

export default router;
