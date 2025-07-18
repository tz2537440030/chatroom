import { Router } from "express";
import {
  createConversation,
  getConversationList,
  getMessages,
} from "./index.controller";
import { tokenMiddleware } from "@/utils/token";

const router = Router();
router.use(tokenMiddleware);
router.post("/createConversation", createConversation);
router.post("/getMessage", getMessages);
router.post("/getConversationList", getConversationList);

export default router;
