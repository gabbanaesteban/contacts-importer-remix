import type { User } from "@prisma/client"
import { Authenticator } from "remix-auth"
import { sessionStorage } from "~/services/session.server"
import { FormStrategy } from "remix-auth-form"
import { findOrCreateUser } from "./user.server"
import { comparePassword } from "~/utils/helpers"

export const authenticator = new Authenticator<User>(sessionStorage)

authenticator.use(
  new FormStrategy(async ({ context }) => {
    const { formData } = context as { formData: FormData }

    const username = formData.get("username") as string
    const password = formData.get("password") as string

    const user = await findOrCreateUser(username, password)

    const result = await comparePassword(password, user.password)

    if (!result) {
      throw new Error("Invalid password")
    }

    return user
  }),
  "user-pass"
)
