import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const siteDocuments = sqliteTable("site_documents", {
  id: text("id").primaryKey(),
  draftJson: text("draft_json").notNull(),
  publishedJson: text("published_json").notNull(),
  revision: integer("revision").notNull().default(1),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  publishedAt: text("published_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const admins = sqliteTable("admins", {
  email: text("email").primaryKey(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const mediaAssets = sqliteTable(
  "media_assets",
  {
    id: text("id").primaryKey(),
    objectKey: text("object_key").notNull(),
    originalFilename: text("original_filename").notNull(),
    contentType: text("content_type").notNull(),
    byteSize: integer("byte_size").notNull(),
    uploadedBy: text("uploaded_by").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [uniqueIndex("idx_media_assets_object_key").on(table.objectKey)],
);
