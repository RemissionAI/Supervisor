import type { DrizzleD1Database } from 'drizzle-orm/d1'
import { drizzle } from 'drizzle-orm/d1'
import type { SQLiteColumn, SQLiteSelect } from 'drizzle-orm/sqlite-core'
import type { SQL } from 'drizzle-orm'
import type { Bindings } from '~/common/interfaces/common.interface'
import * as schema from '~/config/db/schema'

export class BaseRepository {
  // DB instance
  protected readonly db: DrizzleD1Database<typeof schema>

  constructor(env: Bindings) {
    // Initialize the database with the provided schema and environment
    this.db = drizzle(env.SUPERVISOR_DB, { schema })
  }

  /**
   * Applies pagination to a query.
   * @param queryBuilder - The query builder instance.
   * @param orderByColumn - The column or SQL fragment to order by.
   * @param page - The page number to retrieve (default is 1).
   * @param pageSize - The number of items per page (default is 10).
   * @returns The query builder with pagination applied.
   */
  withPagination<T extends SQLiteSelect>(
    queryBuilder: T,
    orderByColumn: SQLiteColumn | SQL,
		page: number = 1,
		pageSize: number = 10,
  ) {
    // Apply order, limit, and offset to the query for pagination
    return queryBuilder
      .orderBy(orderByColumn)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
  }
}
