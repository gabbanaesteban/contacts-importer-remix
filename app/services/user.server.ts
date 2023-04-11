import bcrypt from "bcrypt";
import prisma from "./prisma.server"

export async function createUser(username: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10)

  return prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  })
}

export async function findUser(username: string) {

  return prisma.user.findUnique({
    where: {
      username,
    },
  })
}

export async function findOrCreateUser(username: string, password: string) {
  return await findUser(username) ?? createUser(username, password)
}
