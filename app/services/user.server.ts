import type { PrismaClient } from "@prisma/client"
import { DB_CLIENT } from "~/ioC/constant.server"
import container from "~/ioC/inversify.config.server"
import { hashPassword } from "~/utils/helpers.server"

export async function createUser(username: string, password: string) {
  const prisma = container.get<PrismaClient>(DB_CLIENT)
  const hashedPassword = await hashPassword(password)

  return prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      createdAt: new Date(),
    },
  })
}

export async function findUser(username: string) {
  const prisma = container.get<PrismaClient>(DB_CLIENT)

  return prisma.user.findUnique({
    where: {
      username,
    },
  })
}

export async function findOrCreateUser(username: string, password: string) {
  return await findUser(username) ?? createUser(username, password)
}
