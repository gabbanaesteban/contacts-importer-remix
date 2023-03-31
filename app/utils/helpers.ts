import type { PageAndLimit, Paginated } from "~/types"
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

export function paginateResults<Type>(result: Type[], { page, limit }: PageAndLimit): Paginated<Type> {
  const hasMore = result.length > limit
  const items = hasMore ? result.slice(0, -1) : result
  return { 
    items,
    nextPage: hasMore ? page + 1 : undefined,
    prevPage: page > 1 ? page - 1 : undefined,
  }
}

export function searchParamsToObject(searchParams: URLSearchParams) {
  return Object.fromEntries(searchParams.entries())
}
