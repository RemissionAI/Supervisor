import { knowledge } from "~/config/db/schema";
import { AllowedTrainingSource } from "./train.interface";

export interface KnowledgeMeta {
	source: string;
	type: AllowedTrainingSource;
}

export type Knowledge = typeof knowledge.$inferSelect;
export type InsertKnowledge = typeof knowledge.$inferInsert;