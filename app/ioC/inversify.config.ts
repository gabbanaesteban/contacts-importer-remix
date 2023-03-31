import '@abraham/reflection'
import { Container } from 'inversify'
import { DB_CLIENT } from '~/ioC/constant'
import prisma from '~/utils/db'
import type { PrismaClient } from '@prisma/client'


const container = new Container()

container.bind<PrismaClient>(DB_CLIENT).toConstantValue(prisma())

export default container