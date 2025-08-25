import { Router } from "express";
import {
  cancelLikeMoment,
  changeMomentNoticeRead,
  getMomentList,
  getMomentNoticeList,
  likeMoment,
  newMoment,
  newMomentComment,
} from "./index.controller";
import { tokenMiddleware } from "@/utils/token";

const router = Router();
router.use(tokenMiddleware);
router.post("/newMoment", newMoment);
router.post("/getMomentList", getMomentList);
router.post("/likeMoment", likeMoment);
router.post("/cancelLikeMoment", cancelLikeMoment);
router.post("/newMomentComment", newMomentComment);
router.post("/getMomentNoticeList", getMomentNoticeList);
router.post("/changeMomentNoticeRead", changeMomentNoticeRead);

export default router;
