import bcrypt from "bcrypt";

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10); // 盐轮数 10
};

export const comparePassword = (input: string, hashed: string) => {
  return bcrypt.compare(input, hashed);
};
