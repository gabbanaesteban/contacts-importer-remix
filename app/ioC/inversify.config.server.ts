import '@abraham/reflection'
import { Container } from 'inversify'
import { DB_CLIENT } from '~/ioC/constant.server'
import prisma from '~/utils/db.server'
import type { PrismaClient } from '@prisma/client'


const container = new Container()

container.bind<PrismaClient>(DB_CLIENT).toConstantValue(prisma())

export default container