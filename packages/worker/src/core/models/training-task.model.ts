import { ITrainingTask } from "~/common/interfaces/train.interface";
import { BaseModel } from "./base.model";

export class TrainingTask extends BaseModel {
	id: number;
	type: "url" | "sitemap" | "pdf";
	source: string;
	status: string;
	details: unknown;
	startedAt: Date;
	finishedAt: Date;

	private_fields = [];

	constructor(task: ITrainingTask) {
		super();
		this.id = task.id;
		this.type = task.type;
		this.source = task.source;
		this.status = task.status;
		this.details = task.details;
		this.startedAt = task.startedAt;
		this.finishedAt = task.finishedAt;
	}
}
