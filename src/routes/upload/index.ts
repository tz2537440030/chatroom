// routes/upload.ts
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// 确保上传目录存在
const uploadDir = path.join(__dirname, "../../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 multer 存储方式
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({ storage });

// 上传图片接口
router.post("/upload", upload.single("file"), (req: any, res: any) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const fileUrl = `/uploads/${file.filename}`;
  res.json({ code: 0, data: fileUrl });
});

export default router;
