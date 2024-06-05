DROP TABLE training_tasks;
CREATE TABLE `training_tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text NOT NULL,
	`source` text NOT NULL,
	`status` text NOT NULL,
	`details` text,
	`started_at` integer,
	`finisehd_at` integer
);
