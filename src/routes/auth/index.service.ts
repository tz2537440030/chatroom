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

export const findUserById = (id: number) => {
  return prisma.user.findUnique({
    where: {
      id,
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

export const updateUserInfo = async ({
  userId,
  data,
}: {
  userId: number;
  data: any;
}) => {
  let query = { ...data };
  if (data.password) {
    query = {
      ...data,
      password: await hashPassword(data.password),
    };
  }
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: query,
  });
};
