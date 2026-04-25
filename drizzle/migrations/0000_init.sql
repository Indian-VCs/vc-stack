CREATE TABLE `admin_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` integer NOT NULL,
	`last_login_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_email_unique` ON `admin_users` (`email`);--> statement-breakpoint
CREATE TABLE `audit_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`admin_email` text NOT NULL,
	`action` text NOT NULL,
	`entity` text NOT NULL,
	`entity_id` text,
	`diff` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audit_created_idx` ON `audit_log` (`created_at`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`icon` text,
	`image_url` text,
	`intro` text,
	`buying_criteria` text,
	`related_slugs` text,
	`seo_title` text,
	`seo_description` text,
	`hero_angle` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`archived_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE INDEX `categories_slug_idx` ON `categories` (`slug`);--> statement-breakpoint
CREATE INDEX `categories_sort_idx` ON `categories` (`sort_order`);--> statement-breakpoint
CREATE TABLE `stack_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`firm_name` text NOT NULL,
	`firm_website` text,
	`submitter_name` text NOT NULL,
	`submitter_role` text,
	`submitter_email` text NOT NULL,
	`tool_slugs` text NOT NULL,
	`other_tools` text,
	`notes` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`admin_notes` text,
	`published_slug` text,
	`created_at` integer NOT NULL,
	`reviewed_at` integer
);
--> statement-breakpoint
CREATE INDEX `stack_subs_status_idx` ON `stack_submissions` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `tool_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`tool_name` text NOT NULL,
	`website_url` text NOT NULL,
	`description` text NOT NULL,
	`category_id` text NOT NULL,
	`pricing_model` text,
	`submitter_email` text NOT NULL,
	`submitter_name` text,
	`submitter_firm` text,
	`relationship` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`admin_notes` text,
	`approved_tool_id` text,
	`created_at` integer NOT NULL,
	`reviewed_at` integer
);
--> statement-breakpoint
CREATE INDEX `tool_subs_status_idx` ON `tool_submissions` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `tools` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`short_desc` text,
	`use_cases` text,
	`website_url` text NOT NULL,
	`logo_url` text,
	`pricing_model` text NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`featured_order` integer,
	`category_id` text NOT NULL,
	`extra_category_slugs` text,
	`archived_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tools_slug_unique` ON `tools` (`slug`);--> statement-breakpoint
CREATE INDEX `tools_slug_idx` ON `tools` (`slug`);--> statement-breakpoint
CREATE INDEX `tools_category_idx` ON `tools` (`category_id`);--> statement-breakpoint
CREATE INDEX `tools_featured_idx` ON `tools` (`is_featured`,`featured_order`);