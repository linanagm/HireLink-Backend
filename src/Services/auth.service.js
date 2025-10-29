import { hash } from "../Utils/hash.utils.js";
import prisma from "../../prisma/client.js";
import { generateToken } from "../Utils/jwt.utils.js";
import bcrypt from "bcrypt";

export const userRegister = async ({ name, email, password, phone, role }) => {
  const userIsExist = await prisma.user.findUnique({ where: { email } });
  if (userIsExist) {
    throw { message: "Email already exist", statusCode: 409 };
  }

  const hashedPassword = await hash({ plainText: password });

  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword, phone, role },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      isActive: true,
      emailVerified: true,
    },
  });

  const token = generateToken({
    id: newUser.id,
    role: newUser.role,
  });

  return {
    user: newUser,
    token,
  };
};

// ✅ login service
export const userLogin = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { message: "User not found", statusCode: 404 };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw { message: "Invalid password", statusCode: 401 };

  const token = generateToken({ id: user.id, role: user.role });

  return { user, token };
};








