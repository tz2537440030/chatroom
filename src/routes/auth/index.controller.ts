import HttpException from "@/models/http-exception.model";
import { createUser, findUserByUsername } from "./index.service";
import { sendVerifyCode, verifyCode } from "@/utils/send-email";
import { comparePassword } from "@/utils/bcrypt";
import { generateToken } from "@/utils/token";

export const register = async (
  req: { body: { username: any; password: any; nickname: any; code: any } },
  res: any
) => {
  const { username, password, nickname, code } = req.body;
  const user = await findUserByUsername(username);
  if (!username || !password || !nickname) {
    throw new HttpException(400, "缺少必要参数");
  } else if (user) {
    throw new HttpException(500, "用户已存在");
  } else {
    const isVerifyCode = verifyCode(username, code); // 验证Pass
    if (isVerifyCode) {
      const newUser = await createUser({ username, password, nickname });
      res.json({ code: 0, data: newUser.id, message: "注册成功" });
    }
  }
};

export const sendVerifyCodeController = async (req: any, res: any) => {
  try {
    const { username } = req.body;
    if (!username) {
      throw new HttpException(400, "邮箱不能为空");
    }
    const code = await sendVerifyCode(username);
    if (code) {
      res.json({ code: 0, message: "验证码发送成功" });
    }
  } catch (error) {
    throw new HttpException(500, "验证码发送失败");
  }
};

export const login = async (req: any, res: any) => {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);
  if (!user) {
    throw new HttpException(400, "用户不存在");
  } else if (await comparePassword(password, user.password)) {
    const token = generateToken({ id: user.id });
    res.json({
      code: 0,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          avatar: user.avatar,
        },
      },
      message: "登录成功",
    });
  } else {
    throw new HttpException(400, "密码错误");
  }
};

export const logout = async (req: any, res: any) => {
  res.json({ code: 0, message: "退出登录成功" });
};
