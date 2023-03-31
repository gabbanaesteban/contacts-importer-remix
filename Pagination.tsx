import { Link } from "@remix-run/react"

type PaginationProps = {
  hasMore: boolean
  page: number
  showing: number
  filters: Record<string, string | number>
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

export default function Pagination(props: PaginationProps) {
  const { hasMore, page, showing, filters, onBlur } = props

  const prevPage = page > 1 ? page - 1 : undefined
  const nextPage = hasMore ? page + 1 : undefined

  const prevPageSearchParams = prevPage
    ? new URLSearchParams(JSON.parse(JSON.stringify({ ...filters, page: prevPage })))
    : ""

  const nextPageSearchParams = nextPage
    ? new URLSearchParams(JSON.parse(JSON.stringify({ ...filters, page: nextPage })))
    : ""

  return (
    <div className="d-flex align-items-center justify-content-end m-4">
      <div className="form-group mb-0" style={{ marginRight: "0.5rem", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>Showing</span>

          <input
            onBlur={onBlur}
            className="form-control"
            style={{ width: "6ch", height: "3.5ch", margin: "0.5rem" }}
            defaultValue={showing}
          />
          <span>elements per page</span>
        </div>
      </div>
      <ul className="pagination justify-content-end mb-0">
        <li className={`page-item ${prevPage ? "" : "disabled"}`}>
          <Link className="page-link" to={`?${prevPageSearchParams}`}>
            ←
          </Link>
        </li>
        <li className={`page-item ${nextPage ? "" : "disabled"}`}>
          <Link className="page-link" to={`?${nextPageSearchParams}`}>
            →
          </Link>
        </li>
      </ul>
    </div>
  )
}
