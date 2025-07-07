import jwt from "jsonwebtoken";
export const generateToken = (payload: object) => {
  return jwt.sign(payload, process.env.PRIVATE_KEY as string, {
    expiresIn: "2h",
    algorithm: "HS256",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.PRIVATE_KEY as string);
};
