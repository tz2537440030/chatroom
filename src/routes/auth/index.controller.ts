import HttpException from "@/models/http-exception.model";
import { createUser, findUserByUsername } from "./index.service";

export const register = async (
  req: { body: { username: any; password: any; nickname: any } },
  res: any
) => {
  const { username, password, nickname } = req.body;
  const user = await findUserByUsername(username);

  if (user) {
    throw new HttpException(400, "用户已存在");
  } else {
    const newUser = await createUser({ username, password, nickname });
    res.json({ code: 0, data: newUser.id, message: "注册成功" });
  }
};
