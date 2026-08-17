import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

type SiteBindings = {
  DB?: D1Database;
  MEDIA?: R2Bucket;
  ADMIN_EMAILS?: string;
};

export function getD1(): D1Database {
  const database = (env as unknown as SiteBindings).DB;
  if (!database) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Configure the DB binding before using the CMS.",
    );
  }
  return database;
}

export function getMediaBucket(): R2Bucket {
  const bucket = (env as unknown as SiteBindings).MEDIA;
  if (!bucket) {
    throw new Error(
      "Cloudflare R2 binding `MEDIA` is unavailable. Configure the MEDIA binding before uploading images.",
    );
  }
  return bucket;
}

export function getAdminEmailsSetting(): string {
  return (env as unknown as SiteBindings).ADMIN_EMAILS ?? "";
}

export function getDb() {
  return drizzle(getD1(), { schema });
}
