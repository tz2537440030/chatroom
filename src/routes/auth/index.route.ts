import { Router } from "express";
import {
  changeUserInfo,
  login,
  logout,
  register,
  resetPassword,
  sendVerifyCodeController,
} from "./index.controller";

const router = Router();

router.post("/register", register);
router.post("/send-verify-code", sendVerifyCodeController);
router.post("/login", login);
router.post("/logout", logout);
router.post("/changeUserInfo", changeUserInfo);
router.post("/changePassword", resetPassword);

export default router;
