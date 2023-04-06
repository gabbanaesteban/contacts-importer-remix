import type { PageAndLimit } from "~/types"
import type { z } from "zod"
import { badRequest } from "remix-utils"


export const validateParams = <T extends z.ZodSchema<any>>(data: unknown, schema: T): z.infer<T> => {
  const validation = schema.safeParse(data)

  if (validation.success) {
    return validation.data
  }

  const [error] = validation.error.issues

  console.error(`Validation Error - ${error.path.join(".")}: ${error.message}`)

  throw badRequest(`Validation Error - ${error.path.join(".")}: ${error.message}`)
}

export function swapObjectProps(obj: Record<string, string | number>) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[value] = key
    return acc
  }, {} as Record<string, string | number>)
}

export function composeSkipAndTakeFromPageAndLimit({ page, limit } : PageAndLimit) {
  return {
    skip: (page - 1) * limit,
    take: limit + 1,
  }
}

export function searchParamsToObject(searchParams: URLSearchParams) {
  return Object.fromEntries(searchParams.entries())
}
