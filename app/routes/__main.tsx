import { Form, Link, NavLink, Outlet } from "@remix-run/react"
import Logo from "~/components/Logo"

export default function Layout() {
  return (
    <div className="container py-3">
      <header>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <Logo />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav ms-auto">
                <NavLink className="nav-link" prefetch="intent" to="/">
                  Contacts
                </NavLink>
                <NavLink className="nav-link" prefetch="intent" to="/logs">
                  Logs
                </NavLink>
                <NavLink className="nav-link" prefetch="intent" to="/imports">
                  Imports
                </NavLink>
                <NavLink className="nav-link" prefetch="intent" to="/new-import">
                  New Import
                </NavLink>
                <Form method="post" action="/logout">
                  <button className="nav-link btn btn-link text-danger" type="submit">Logout</button>
                </Form>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
