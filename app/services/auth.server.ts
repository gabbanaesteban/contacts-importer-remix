import type { User } from "@prisma/client"
import { Authenticator } from "remix-auth"
import { sessionStorage } from "~/services/session.server"
import { FormStrategy } from "remix-auth-form"
import { findOrCreateUser } from "./user.server"
import { comparePassword } from "~/utils/helpers.server"
import { unauthorized } from "remix-utils"

export const authenticator = new Authenticator<User>(sessionStorage)

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get("username") as string
    const password = form.get("password") as string

    const user = await findOrCreateUser(username, password)

    const result = await comparePassword(password, user.password)

    if (!result) {
      throw unauthorized("Invalid password")
    }

    return user
  }),
  "user-pass"
)
