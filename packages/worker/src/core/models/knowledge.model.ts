import { BaseModel } from "./base.model";
import type {
    Knowledge,
} from "~/common/interfaces/knowledge.interface";

export class KnowledgeModel extends BaseModel {
    id: number;
    task_id: number;
    type: string;
    source: string;
    createdAt: Date;
    updatedAt: Date;

	private_fields = [];

	constructor(knowledge: Knowledge) {
		super();
		this.id = knowledge.id
        this.task_id = knowledge.task_id
        this.type = knowledge.type
        this.source = knowledge.source
        this.createdAt = knowledge.createdAt
        this.updatedAt = knowledge.updatedAt
	}
}
