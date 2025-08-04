import { Router } from "express";
import {
  cancelLikeMoment,
  getMomentList,
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

export default router;
