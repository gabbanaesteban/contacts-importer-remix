import type { PrismaClient } from "@prisma/client"
import type { LoaderArgs, LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import PageHeader from "~/components/PageHeader"
import Pagination from "~/components/Pagination"
import { DB_CLIENT } from "~/ioC/constant"
import container from "~/ioC/inversify.config"
import { listLogsSchema } from "~/schemas/schemas"
import { composeSkipAndTakeFromPageAndLimit, searchParamsToObject, validateParams } from "~/utils/helpers"

export function meta() {
  return {
    title: "Logs",
    description: "List of errors while importing contacts.",
  }
}

export async function loader({ request }: LoaderArgs) {
  const params = searchParamsToObject(new URL(request.url).searchParams)
  const { limit, page, importId } = validateParams(params, listLogsSchema)
  const { skip, take } = composeSkipAndTakeFromPageAndLimit({ page, limit })

  const prisma = container.get<PrismaClient>(DB_CLIENT)

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
    pagination: {
      hasMore,
      filters: { limit, page, importId },
    },
  }
}

export default function Logs() {
  const { logs, pagination: { filters, hasMore } } = useLoaderData<typeof loader>()
  const { title, description } = meta()

  return (
    <>
      <PageHeader title={title} description={description} />

      <Pagination hasMore={hasMore} filters={filters} />

      <div className="table-responsive">
        <table className="table text-center">
          <thead>
            <tr>
              <th>Import</th>
              <th>Row Number</th>
              <th>Error</th>
              <th>Row Data</th>
              <th>Used Mapping</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(({ Import, ...log }) => (
              <tr key={log.id}>
                <td>{Import.originalName}</td>
                <td>{log.rowNumber}</td>
                <td className="text-danger">{log.error}</td>
                <td>{JSON.stringify(log.rowData, null, 2)}</td>
                <td>{JSON.stringify(Import.mapping, null, 2)}</td>
                <td>{log.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
