CREATE TABLE `admins` (
	`email` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text
);
--> statement-breakpoint
CREATE TABLE `media_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`object_key` text NOT NULL,
	`original_filename` text NOT NULL,
	`content_type` text NOT NULL,
	`byte_size` integer NOT NULL,
	`uploaded_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_media_assets_object_key` ON `media_assets` (`object_key`);--> statement-breakpoint
CREATE TABLE `site_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`draft_json` text NOT NULL,
	`published_json` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`published_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
