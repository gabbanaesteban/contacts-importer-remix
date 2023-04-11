import type { LoaderArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import PageHeader from "~/components/PageHeader"
import Pagination from "~/components/Pagination"
import { listImportsSchema } from "~/schemas/schemas"
import { authenticator } from "~/services/auth.server"
import prisma from "~/services/prisma.server"
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

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  const imports = await prisma.import.findMany({
    where: { userId: user.id },
    include: { _count: { select: { Log: true } } },
    skip,
    take,
  })

  const hasMore = imports.length > limit
  const items = hasMore ? imports.slice(0, -1) : imports

  return {
    imports: items,
    pagination: {
      hasMore,
      filters: { limit, page },
    },
  }
}

export default function Imports() {
  const { imports, pagination: { filters, hasMore } } = useLoaderData<typeof loader>()
  const { title, description } = meta()

  return (
    <>
      <PageHeader title={title} description={description} />

      <Pagination hasMore={hasMore} filters={filters} />

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
                    <a href={`/logs?importId=${imp.id}`}>
                      View
                    </a>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
