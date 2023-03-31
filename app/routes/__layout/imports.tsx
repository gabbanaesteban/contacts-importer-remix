import type { PrismaClient } from "@prisma/client"
import type { LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import PageHeader from "~/components/PageHeader"
import Pagination from "~/components/Pagination"
import { DB_CLIENT } from "~/ioC/constant"
import container from "~/ioC/inversify.config"
import { listImportsSchema } from "~/schemas/schemas"
import {
  composeSkipAndTakeFromPageAndLimit,
  searchParamsToObject,
  validateParams,
} from "~/utils/helpers"

export function meta() {
  return {
    title: "Imports",
    description: "List of imports",
  }
}

export async function loader({ request }: LoaderArgs) {
  const params = searchParamsToObject(new URL(request.url).searchParams)
  const { limit, page } = validateParams(params, listImportsSchema)
  const { skip, take } = composeSkipAndTakeFromPageAndLimit({ page, limit })

  const prisma = container.get<PrismaClient>(DB_CLIENT)

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
    pagination: {
      limit,
      hasMore,
      page,
      filters: { limit },
    },
  }
}

export default function Imports() {
  const { imports, pagination } = useLoaderData<typeof loader>()
  const { limit, filters, page, hasMore } = pagination
  const { title, description } = meta()

  return (
    <>
      <PageHeader title={title} description={description} />

      <Pagination showing={limit} page={page} hasMore={hasMore} filters={filters} />

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>File</th>
              <th>Status</th>
              <th>Created</th>
              <th>Fail</th>
              <th>Logs</th>
            </tr>
          </thead>
          <tbody>
            {imports.map((imp) => (
              <tr key={imp.id}>
                <td>{imp.originalName}</td>
                <td>{imp.status}</td>
                <td>{imp.createdAt}</td>
                <td>{imp._count.Log}</td>
                <td>
                  {imp._count.Log ? (
                    <Link prefetch="intent" to={`/logs?importId=${imp.id}`}>
                      View
                    </Link>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination showing={limit} page={page} hasMore={hasMore} filters={filters} />
    </>
  )
}
