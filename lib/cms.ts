import { getD1 } from "@/db";
import {
  cloneDefaultSiteContent,
  DEFAULT_SITE_CONTENT,
  parseSiteContent,
  type SiteContent,
} from "@/lib/content";

const SITE_DOCUMENT_ID = "main";
const DEFAULT_JSON = JSON.stringify(DEFAULT_SITE_CONTENT);

type SiteDocumentRow = {
  id: string;
  draft_json: string;
  published_json: string;
  revision: number;
  updated_at: string;
  published_at: string;
};

export type CmsSnapshot = {
  draft: SiteContent;
  published: SiteContent;
  revision: number;
  updatedAt: string;
  publishedAt: string;
};

export type MediaRecord = {
  id: string;
  objectKey: string;
  filename: string;
  contentType: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
};

type MediaRow = {
  id: string;
  object_key: string;
  original_filename: string;
  content_type: string;
  byte_size: number;
  uploaded_by: string;
  created_at: string;
};

export class CmsRevisionConflictError extends Error {
  readonly current: CmsSnapshot;

  constructor(current: CmsSnapshot) {
    super("The content changed since it was loaded. Refresh and try again.");
    this.name = "CmsRevisionConflictError";
    this.current = current;
  }
}

let initialization: Promise<void> | null = null;

/**
 * Migrations are still generated and deployed normally. This lightweight,
 * idempotent bootstrap makes a newly attached D1 safe on its very first request
 * and seeds the one document that the presentation site uses.
 */
export async function ensureCmsDatabase(): Promise<void> {
  if (!initialization) {
    initialization = initializeDatabase().catch((error) => {
      initialization = null;
      throw error;
    });
  }
  await initialization;
}

export async function getCmsSnapshot(): Promise<CmsSnapshot> {
  await ensureCmsDatabase();
  const row = await readDocumentRow();
  return snapshotFromRow(row);
}

export async function getPublishedContent(): Promise<SiteContent> {
  try {
    const snapshot = await getCmsSnapshot();
    return snapshot.published;
  } catch (error) {
    // The public company presentation should remain useful during a transient
    // binding or data incident. Admin endpoints intentionally do not use this
    // fallback, so operational problems remain visible to an editor.
    console.error("Unable to read published CMS content; using safe defaults", error);
    return cloneDefaultSiteContent();
  }
}

export async function saveDraft(
  input: unknown,
  expectedRevision: number,
): Promise<CmsSnapshot> {
  const content = parseSiteContent(input);
  assertRevision(expectedRevision);
  await ensureCmsDatabase();

  const row = await getD1()
    .prepare(
      `UPDATE site_documents
       SET draft_json = ?, revision = revision + 1, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND revision = ?
       RETURNING id, draft_json, published_json, revision, updated_at, published_at`,
    )
    .bind(JSON.stringify(content), SITE_DOCUMENT_ID, expectedRevision)
    .first<SiteDocumentRow>();

  if (!row) throw new CmsRevisionConflictError(await getCmsSnapshot());
  return snapshotFromRow(row);
}

export async function publishDraft(expectedRevision: number): Promise<CmsSnapshot> {
  assertRevision(expectedRevision);
  await ensureCmsDatabase();

  const row = await getD1()
    .prepare(
      `UPDATE site_documents
       SET published_json = draft_json,
           revision = revision + 1,
           updated_at = CURRENT_TIMESTAMP,
           published_at = CURRENT_TIMESTAMP
       WHERE id = ? AND revision = ?
       RETURNING id, draft_json, published_json, revision, updated_at, published_at`,
    )
    .bind(SITE_DOCUMENT_ID, expectedRevision)
    .first<SiteDocumentRow>();

  if (!row) throw new CmsRevisionConflictError(await getCmsSnapshot());
  return snapshotFromRow(row);
}

export async function createMediaRecord(input: {
  id: string;
  objectKey: string;
  filename: string;
  contentType: string;
  size: number;
  uploadedBy: string;
}): Promise<MediaRecord> {
  await ensureCmsDatabase();
  const row = await getD1()
    .prepare(
      `INSERT INTO media_assets
         (id, object_key, original_filename, content_type, byte_size, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?)
       RETURNING id, object_key, original_filename, content_type, byte_size, uploaded_by, created_at`,
    )
    .bind(
      input.id,
      input.objectKey,
      input.filename,
      input.contentType,
      input.size,
      input.uploadedBy,
    )
    .first<MediaRow>();

  if (!row) throw new Error("The uploaded image metadata could not be saved.");
  return mediaRecordFromRow(row);
}

export async function getMediaRecord(id: string): Promise<MediaRecord | null> {
  if (!/^[a-f0-9-]{16,64}$/i.test(id)) return null;
  await ensureCmsDatabase();
  const row = await getD1()
    .prepare(
      `SELECT id, object_key, original_filename, content_type, byte_size, uploaded_by, created_at
       FROM media_assets WHERE id = ? LIMIT 1`,
    )
    .bind(id)
    .first<MediaRow>();
  return row ? mediaRecordFromRow(row) : null;
}

async function initializeDatabase() {
  const database = getD1();
  await database.batch([
    database.prepare(
      `CREATE TABLE IF NOT EXISTS site_documents (
         id TEXT PRIMARY KEY NOT NULL,
         draft_json TEXT NOT NULL,
         published_json TEXT NOT NULL,
         revision INTEGER NOT NULL DEFAULT 1,
         updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
         published_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
       )`,
    ),
    database.prepare(
      `CREATE TABLE IF NOT EXISTS admins (
         email TEXT PRIMARY KEY NOT NULL,
         created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
         created_by TEXT
       )`,
    ),
    database.prepare(
      `CREATE TABLE IF NOT EXISTS media_assets (
         id TEXT PRIMARY KEY NOT NULL,
         object_key TEXT NOT NULL,
         original_filename TEXT NOT NULL,
         content_type TEXT NOT NULL,
         byte_size INTEGER NOT NULL,
         uploaded_by TEXT NOT NULL,
         created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
       )`,
    ),
    database.prepare(
      "CREATE UNIQUE INDEX IF NOT EXISTS idx_media_assets_object_key ON media_assets (object_key)",
    ),
    database
      .prepare(
        `INSERT OR IGNORE INTO site_documents
           (id, draft_json, published_json, revision)
         VALUES (?, ?, ?, 1)`,
      )
      .bind(SITE_DOCUMENT_ID, DEFAULT_JSON, DEFAULT_JSON),
  ]);

  await database.prepare("PRAGMA optimize").run();
}

async function readDocumentRow(): Promise<SiteDocumentRow> {
  const row = await getD1()
    .prepare(
      `SELECT id, draft_json, published_json, revision, updated_at, published_at
       FROM site_documents WHERE id = ? LIMIT 1`,
    )
    .bind(SITE_DOCUMENT_ID)
    .first<SiteDocumentRow>();
  if (!row) throw new Error("The CMS document is unavailable.");
  return row;
}

function snapshotFromRow(row: SiteDocumentRow): CmsSnapshot {
  return {
    draft: parseStoredContent(row.draft_json, "draft"),
    published: parseStoredContent(row.published_json, "published"),
    revision: Number(row.revision),
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
  };
}

function parseStoredContent(json: string, label: string): SiteContent {
  let input: unknown;
  try {
    input = JSON.parse(json);
  } catch {
    throw new Error(`The stored ${label} content is not valid JSON.`);
  }
  return parseSiteContent(input);
}

function mediaRecordFromRow(row: MediaRow): MediaRecord {
  return {
    id: row.id,
    objectKey: row.object_key,
    filename: row.original_filename,
    contentType: row.content_type,
    size: Number(row.byte_size),
    uploadedBy: row.uploaded_by,
    createdAt: row.created_at,
  };
}

function assertRevision(value: number): asserts value is number {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new TypeError("revision must be a positive integer");
  }
}
