CREATE TABLE `update_feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`tool_slug` text NOT NULL,
	`kind` text NOT NULL,
	`field_area` text,
	`suggestion` text,
	`submitter_email` text,
	`submitter_role` text,
	`ip_hash` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`admin_notes` text,
	`created_at` integer NOT NULL,
	`reviewed_at` integer
);
--> statement-breakpoint
CREATE INDEX `update_feedback_tool_idx` ON `update_feedback` (`tool_slug`,`kind`,`status`);--> statement-breakpoint
CREATE INDEX `update_feedback_status_idx` ON `update_feedback` (`status`,`created_at`);