CREATE TABLE `knowledge_index` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`task_id` integer NOT NULL,
	`type` text NOT NULL,
	`source` text NOT NULL,
	`content` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`task_id`) REFERENCES `training_tasks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `knowledge`;