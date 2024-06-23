import type { Context } from 'hono'
import { number, object } from 'zod'

export interface Pagination {
  page: number
  limit: number
}

export const paginationSchema = object({
  page: number().positive().default(1),
  limit: number().positive(),
})

export function getPagination(
  c: Context,
  defaultLimit: number = 10,
): Pagination {
  const rawPage = c.req.query('page')
  const rawLimit = c.req.query('size')

  const parsedPagination = parsePagination(rawPage, rawLimit)

  if (!parsedPagination.success) {
    return {
      page: 1,
      limit: defaultLimit,
    }
  }

  return {
    page: parsedPagination.data.page,
    limit: parsedPagination.data.limit || defaultLimit,
  }
}

function parsePagination(page?: string, limit?: string) {
  return paginationSchema.safeParse({
    page: page ? Number.parseInt(page) : undefined,
    limit: limit ? Number.parseInt(limit) : undefined,
  })
}
