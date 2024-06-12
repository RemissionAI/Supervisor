ALTER TABLE `training_tasks` ADD `data` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `training_tasks` DROP COLUMN `source`;