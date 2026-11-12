CREATE TABLE `players` (
	`id` text PRIMARY KEY NOT NULL,
	`registration_id` text NOT NULL,
	`position` integer NOT NULL,
	`name` text NOT NULL,
	`mobile` text NOT NULL,
	`employee_key` text NOT NULL,
	`data` text NOT NULL,
	FOREIGN KEY (`registration_id`) REFERENCES `registrations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `players_mobile_unique` ON `players` (`mobile`);--> statement-breakpoint
CREATE UNIQUE INDEX `players_employee_key_unique` ON `players` (`employee_key`);--> statement-breakpoint
CREATE TABLE `registrations` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`company` text NOT NULL,
	`company_key` text NOT NULL,
	`team` text NOT NULL,
	`data` text NOT NULL,
	`rules_version` text NOT NULL,
	`status` text DEFAULT 'pending_review' NOT NULL,
	`created_at` text NOT NULL,
	`idempotency_key` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `registrations_company_key_unique` ON `registrations` (`company_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `registrations_idempotency_key_unique` ON `registrations` (`idempotency_key`);