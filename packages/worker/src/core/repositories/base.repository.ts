import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { Bindings } from "~/common/interfaces/common.interface";

export class BaseRepository {
	protected readonly db: DrizzleD1Database;

	constructor(env: Bindings) {
		this.db = drizzle(env.SUPERVISOR_DB);
	}
}
