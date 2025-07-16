import { Router } from "express";
import {
  login,
  logout,
  register,
  sendVerifyCodeController,
} from "./index.controller";

const router = Router();

router.post("/register", register);
router.post("/send-verify-code", sendVerifyCodeController);
router.post("/login", login);
router.post("/logout", logout);

export default router;
