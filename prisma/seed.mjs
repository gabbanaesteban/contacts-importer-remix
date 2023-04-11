import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: { username: "gabbanaesteban" },
    update: {},
    create: {
      username: "gabbanaesteban",
      password: "$2b$10$BTPChL6OTPw8krJr4TI/5.CcOqnyP6mlzWILiVaO7R8.7iW8t1Rg6", //123456
    },
  })
}

try {
  await main()
  await prisma.$disconnect()
} catch (error) {
  console.error(error)
  await prisma.$disconnect()
  process.exit(1)
}
