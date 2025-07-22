import { Router } from "express";
import {
  createFriendRequest,
  getUserListByText,
  getFriendRequestList,
  changeRequestStatus,
  getFriendList,
  deleteFriend,
  changeFriendRequestRead,
} from "./index.controller";
import { tokenMiddleware } from "@/utils/token";

const router = Router();
router.use(tokenMiddleware);
router.post("/getUserListByText", getUserListByText);
router.post("/createFriendRequest", createFriendRequest);
router.post("/getFriendRequestList", getFriendRequestList);
router.post("/changeRequestStatus", changeRequestStatus);
router.post("/getFriendList", getFriendList);
router.post("/deleteFriend", deleteFriend);
router.post("/changeFriendRequestRead", changeFriendRequestRead);

export default router;
