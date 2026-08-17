import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("ships the Avokodo presentation instead of the starter preview", async () => {
  const [page, layout, packageJson, hosting] = await Promise.all([
    source("app/page.tsx"),
    source("app/layout.tsx"),
    source("package.json"),
    source(".openai/hosting.json"),
  ]);

  assert.match(page, /getPublishedContent/);
  assert.match(page, /force-dynamic/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.match(layout, /Avokodo/);
  assert.match(layout, /\/og\.png/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  const hostingConfig = JSON.parse(hosting);
  assert.equal(hostingConfig.d1, "DB");
  assert.equal(hostingConfig.r2, "MEDIA");
  assert.match(hostingConfig.project_id, /^appgprj_/);
  await assert.rejects(access(new URL("app/_sites-preview", root)));
  await access(new URL("public/og.png", root));
});

test("protects editing and mutation routes on the server", async () => {
  const [adminPage, contentRoute, mediaRoute, contentModel] = await Promise.all([
    source("app/admin/page.tsx"),
    source("app/api/admin/content/route.ts"),
    source("app/api/admin/media/route.ts"),
    source("lib/content.ts"),
  ]);

  assert.match(adminPage, /requireChatGPTUser/);
  assert.match(adminPage, /requireAdmin/);
  assert.match(contentRoute, /assertSameOrigin/);
  assert.match(contentRoute, /requireAdmin/);
  assert.match(contentRoute, /CmsRevisionConflictError/);
  assert.match(mediaRoute, /MAX_IMAGE_BYTES/);
  assert.match(mediaRoute, /signatureMatches/);
  assert.match(contentModel, /plain text without HTML/);
  assert.match(contentModel, /ctaHref/);
});
