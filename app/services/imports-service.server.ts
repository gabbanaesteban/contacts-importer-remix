import type { MappingMap, PageAndLimit } from "~/types";
import type { PrismaClient } from "@prisma/client"
import type { NodeOnDiskFile } from "@remix-run/node"
import container from "~/ioC/inversify.config.server"
import { DB_CLIENT } from "~/ioC/constant.server"
import { ImportStatus } from "~/types"
import { composeSkipAndTakeFromPageAndLimit, swapObjectProps } from "~/utils/helpers"
import env from "~/env"


export async function createImport(file: NodeOnDiskFile, mapping: MappingMap) {
  const prisma = container.get<PrismaClient>(DB_CLIENT)

  // TODO: Add to a client
  await prisma.import.create({
    data: {
      filePath: `${env.UPLOADS_DIR}/${file.name}`,
      originalName: file.name.split("*").pop() ?? "",
      mapping: swapObjectProps(mapping),
      status: ImportStatus.ON_HOLD,
      userId: 1,
      createdAt: new Date(),
    },
  })
}

export async function getImports(params: PageAndLimit) {
  const { page, limit } = params
  const { skip, take } = composeSkipAndTakeFromPageAndLimit({ page, limit })

  const prisma = container.get<PrismaClient>(DB_CLIENT)

  // TODO: filter by client
  const imports = await prisma.import.findMany({
    // where: { userId: this.user.id },
    include: { _count: { select: { Log: true } } },
    skip,
    take,
  })

  const hasMore = imports.length > limit
  const items = hasMore ? imports.slice(0, -1) : imports

  return {
    imports: items,
    hasMore,
  }
}

export async function createMapping(mappingName: string, mapping: MappingMap) {
  const prisma = container.get<PrismaClient>(DB_CLIENT)

  // TODO: Add to a client
  await prisma.mapping.create({
    data: { ownerId: 1, name: mappingName, map: mapping, createdAt: new Date() },
  })
}

export function getMappings() {
  const prisma = container.get<PrismaClient>(DB_CLIENT)
  // TODO: filter by client
  return prisma.mapping.findMany({ where: { ownerId: 1 } })
}

export async function getLogs(params: PageAndLimit & { importId?: number }) {
  const { page, limit, importId } = params
  const { skip, take } = composeSkipAndTakeFromPageAndLimit({ page, limit })

  const prisma = container.get<PrismaClient>(DB_CLIENT)

  // TODO: filter by client
  const logs = await prisma.log.findMany({
    where: { importId },
    include: { Import: true },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    skip,
    take,
  })

  const hasMore = logs.length > limit
  const items = hasMore ? logs.slice(0, -1) : logs

  return {
    logs: items,
    hasMore,
  }
}
