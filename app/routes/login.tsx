import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react"
import Logo from "~/components/Logo"
import { authSchema } from "~/schemas/schemas";
import { authenticator } from "~/services/auth.server";
import authStyles from "~/styles/auth.css"
import { validateParams } from "~/utils/helpers";

export function links() {
  return [{ rel: "stylesheet", href: authStyles }]
}

export async function loader({ request }: LoaderArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  validateParams(Object.fromEntries(formData.entries()), authSchema)
  
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
    failureRedirect: "/login",
    context: { formData },
  });
};

export default function Login() {
  return (
    <main className="auth text-center">
      <div className="form-auth w-100 m-auto">
        <div className="mb-5 fw-normal">
          <Logo width={100} height={100}/>
        </div>
        <Form data-bitwarden-watching="1" method="post">
          <div className="form-floating">
            <input type="text" id="floatingInput" name="username" className="form-control" required />
            <label htmlFor="floatingInput">Username</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              id="floatingPassword"
              name="password"
              className="form-control"
              placeholder="Password"
              required
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <button className="mt-3 w-100 btn btn-lg btn-primary" type="submit">
            Sign in
          </button>
          <p>
            <Link prefetch="intent" to="/signup">Don't have an account?</Link>
          </p>
        </Form>
      </div>
    </main>
  )
}
