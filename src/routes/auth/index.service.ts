import prisma from "#/prisma-client";
import { hashPassword } from "@/utils/bcrypt";
/**
 * 使用用户名查找用户
 * @param {string} username
 * @returns {Promise<User | null>}
 */
export const findUserByUsername = (username: string) => {
  return prisma.user.findUnique({
    where: {
      username,
    },
  });
};

export const createUser = async ({
  username,
  password,
  nickname,
}: {
  username: string;
  password: string;
  nickname: string;
}) => {
  return prisma.user.create({
    data: {
      username,
      nickname,
      password: await hashPassword(password),
    },
  });
};
