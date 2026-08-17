import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

async function contentModule() {
  return import(new URL("lib/content.ts", root));
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
  assert.match(layout, /Product design/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  const hostingConfig = JSON.parse(hosting);
  assert.equal(hostingConfig.d1, "DB");
  assert.equal(hostingConfig.r2, "MEDIA");
  assert.match(hostingConfig.project_id, /^appgprj_/);
  await assert.rejects(access(new URL("app/_sites-preview", root)));
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
  assert.match(contentModel, /about\.facts/);
});

test("uses verified Avokodo profile content and portfolio assets", async () => {
  const { DEFAULT_SITE_CONTENT, parseSiteContent } = await contentModule();

  assert.doesNotThrow(() => parseSiteContent(DEFAULT_SITE_CONTENT));
  assert.equal(DEFAULT_SITE_CONTENT.site.name, "Avokodo");
  assert.match(DEFAULT_SITE_CONTENT.hero.title, /production/i);
  assert.equal(DEFAULT_SITE_CONTENT.hero.image.url, "/upwork-assets/brand-film.jpg");
  assert.deepEqual(
    DEFAULT_SITE_CONTENT.about.facts.map(({ value, label }) => [value, label]),
    [
      ["100%", "Upwork Job Success"],
      ["Top Rated", "Upwork status"],
      ["28", "Total jobs"],
      ["10+", "Years of experience"],
    ],
  );
  assert.match(DEFAULT_SITE_CONTENT.about.paragraphs.join(" "), /5\.0 rating across 22 reviews/);
  assert.deepEqual(
    DEFAULT_SITE_CONTENT.work.items.map(({ title, image }) => [title, image?.url]),
    [
      ["High-end personal accessories", "/upwork-assets/high-end-accessories.jpg"],
      [
        "Wearable product from design to manufacture",
        "/upwork-assets/wearable-product.jpg",
      ],
      ["Phone case + leather", "/upwork-assets/phone-case-leather.jpg"],
    ],
  );
  assert.equal(
    DEFAULT_SITE_CONTENT.contact.ctaHref,
    "https://www.upwork.com/freelancers/~01fbedf6c79f177fea?viewMode=1",
  );
});

test("accepts only approved bundled images or matching managed media URLs", async () => {
  const {
    cloneDefaultSiteContent,
    parseSiteContent,
    SiteContentValidationError,
  } = await contentModule();

  const managed = cloneDefaultSiteContent();
  const managedId = "a48b248c-9a84-4b4f-82aa-37b8c703af39";
  managed.about.image = {
    id: managedId,
    url: `/media/${managedId}`,
    alt: "Uploaded Avokodo prototype",
  };
  assert.doesNotThrow(() => parseSiteContent(managed));

  const unapproved = cloneDefaultSiteContent();
  unapproved.hero.image = {
    id: "upwork-brand-film",
    url: "/upwork-assets/unapproved.jpg",
    alt: "Unapproved image path",
  };
  assert.throws(
    () => parseSiteContent(unapproved),
    (error) =>
      error instanceof SiteContentValidationError &&
      error.issues.some((issue) => issue.includes("approved bundled image")),
  );

  const mismatched = cloneDefaultSiteContent();
  mismatched.work.items[0].image = {
    id: "upwork-wearable-product",
    url: "/upwork-assets/high-end-accessories.jpg",
    alt: "Mismatched bundled asset",
  };
  assert.throws(
    () => parseSiteContent(mismatched),
    (error) =>
      error instanceof SiteContentValidationError &&
      error.issues.some((issue) => issue.includes("match")),
  );
});

test("bounds editable profile facts and safely migrates legacy content", async () => {
  const {
    cloneDefaultSiteContent,
    parseSiteContent,
    SiteContentValidationError,
  } = await contentModule();
  const migration = await source("drizzle/0001_refresh_default_content.sql");

  const tooManyFacts = cloneDefaultSiteContent();
  tooManyFacts.about.facts.push(
    { id: "extra-one", value: "5.0", label: "Rating" },
    { id: "extra-two", value: "22", label: "Reviews" },
    { id: "extra-three", value: "3", label: "Locations" },
  );
  assert.throws(
    () => parseSiteContent(tooManyFacts),
    (error) =>
      error instanceof SiteContentValidationError &&
      error.issues.some((issue) => issue.includes("between 1 and 6 items")),
  );

  const longFactValue = cloneDefaultSiteContent();
  longFactValue.about.facts[0].value = "x".repeat(25);
  assert.throws(
    () => parseSiteContent(longFactValue),
    (error) =>
      error instanceof SiteContentValidationError &&
      error.issues.some((issue) => issue.includes("between 1 and 24 characters")),
  );

  assert.match(migration, /revision = 1/);
  assert.match(migration, /draft_json = published_json/);
  assert.match(migration, /We turn complex product ideas into clear, useful experiences/);
  assert.match(migration, /json_type\(draft_json, '\$\.about\.facts'\) IS NULL/);
});
