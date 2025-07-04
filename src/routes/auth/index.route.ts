import { Router } from "express";
import { register } from "./index.controller";

const router = Router();

router.post("/register", register);

export default router;
