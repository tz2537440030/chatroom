import { Router } from "express";
import {
  createFriendRequest,
  getUserListByText,
  getFriendRequestList,
  changeRequestStatus,
  getFriendList,
} from "./index.controller";
import { tokenMiddleware } from "@/utils/token";

const router = Router();
router.use(tokenMiddleware);
router.post("/getUserListByText", getUserListByText);
router.post("/createFriendRequest", createFriendRequest);
router.post("/getFriendRequestList", getFriendRequestList);
router.post("/changeRequestStatus", changeRequestStatus);
router.post("/getFriendList", getFriendList);

export default router;
