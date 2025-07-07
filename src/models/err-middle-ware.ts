import { Request, Response, NextFunction } from "express";
import HttpException from "./http-exception.model"; // 替换为你的路径

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpException) {
    res.status(err.code).json({
      code: err.code,
      message: err.message,
    });
  } else {
    res.status(500).json({
      code: 500,
      message: err.message || "服务器内部错误",
    });
  }
};

export default errorMiddleware;
