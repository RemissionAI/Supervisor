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

export function paginated(c: Context, defaultLimit: number = 10): Pagination {
  const rawPage = c.req.query('page')
  const rawLimit = c.req.query('size')

  const validate = paginationSchema.safeParse({
    page: rawPage ? Number.parseInt(rawPage) : undefined,
    limit: rawLimit ? Number.parseInt(rawLimit) : undefined,
  })

  if (!validate.success) {
    return {
      page: 1,
      limit: defaultLimit,
    }
  }

  const { page, limit } = validate.data

  return {
    page: page || 1,
    limit: limit || defaultLimit,
  }
}
