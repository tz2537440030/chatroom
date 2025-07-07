import HttpException from "@/models/http-exception.model";
import nodemailer from "nodemailer";

let code = "";
const emailCodeMap = new Map<string, string | undefined>();
const transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerifyCode = async (email: string) => {
  try {
    code = Math.random().toString().substr(2, 4);
    const info = await transporter.sendMail({
      from: "2537440030<2537440030@qq.com>", // sender address
      to: email, // list of receivers
      subject: "验证码", // Subject line
      text: `宁的验证码是：${code}`, // plain text body
    });
    if (info) {
      emailCodeMap.set(email, code);
      setTimeout(() => emailCodeMap.delete(email), 5 * 60 * 1000); // 5分钟后过期
      return code;
    }
  } catch (error) {
    throw new HttpException(500, "验证码发送失败");
  }
};

export const verifyCode = (email: string, reqCode: string) => {
  const savedCode = emailCodeMap.get(email);
  if (savedCode === reqCode) {
    emailCodeMap.delete(email); // 一次性验证码
    return true;
  } else {
    throw new HttpException(400, "验证码错误或已过期");
  }
};
