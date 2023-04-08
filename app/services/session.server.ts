import { createCookieSessionStorage } from "@remix-run/node";
import env from "~/env";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "importer_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [env.COOKIE_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;