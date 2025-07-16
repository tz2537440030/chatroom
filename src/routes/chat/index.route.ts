import { Router } from "express";
import { createConversation, getMessages } from "./index.controller";

const router = Router();

router.post("/createConversation", createConversation);
router.post("/getMessage", getMessages);

export default router;
