import type { PageAndLimit } from "~/types"
import type { PrismaClient } from "@prisma/client"
import container from "~/ioC/inversify.config.server"
import { DB_CLIENT } from "~/ioC/constant.server"
import { composeSkipAndTakeFromPageAndLimit } from "~/utils/helpers"

export async function getContacts(params: PageAndLimit) {
  const { page, limit } = params
  const { skip, take } = composeSkipAndTakeFromPageAndLimit({ page, limit })

  const prisma = container.get<PrismaClient>(DB_CLIENT)

  // TODO: filter by client
  const contacts = await prisma.contact.findMany({ skip, take })

  const hasMore = contacts.length > limit
  const items = hasMore ? contacts.slice(0, -1) : contacts

  return {
    contacts: items,
    hasMore,
  }
}
