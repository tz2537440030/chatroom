import jwt from "jsonwebtoken";
import HttpException from "@/models/http-exception.model";
export const generateToken = (payload: object) => {
  return jwt.sign(payload, process.env.PRIVATE_KEY as string, {
    expiresIn: "2h",
    algorithm: "HS256",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.PRIVATE_KEY as string);
};

export const tokenMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    throw new HttpException(401, "token not found");
  }

  try {
    const decoded: any = verifyToken(token);
    req.user = decoded;
    // token续期
    const newToken = generateToken({ id: decoded.id });
    res.setHeader("New-Token", newToken); // 返回新 Token 给客户端
    next();
  } catch (error: any) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      throw new HttpException(401, "Token expired");
    }
    throw new HttpException(401, "Invalid token");
  }
};
