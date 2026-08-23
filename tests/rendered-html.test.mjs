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

function contentImages(content) {
  return [
    content.hero.image,
    content.about.image,
    ...content.work.items.map((item) => item.image),
  ].filter(Boolean);
}

test("uses checked-in content and has no CMS runtime surface", async () => {
  const [page, contentModel] = await Promise.all([
    source("app/page.tsx"),
    source("lib/content.ts"),
  ]);

  assert.match(page, /force-static/);
  assert.match(page, /DEFAULT_SITE_CONTENT|PUBLISHED_SITE_CONTENT/);
  assert.doesNotMatch(page, /getPublishedContent|force-dynamic/);
  assert.match(contentModel, /PUBLISHED_SITE_CONTENT/);
  assert.doesNotMatch(contentModel, /\/media\/|MEDIA_URL_PATTERN/);

  await Promise.all(
    [
      "lib/cms.ts",
      "lib/admin-auth.ts",
      "app/api/admin/content/route.ts",
      "app/api/admin/media/route.ts",
      "app/api/admin/publish/route.ts",
      "app/api/admin/session/route.ts",
      "app/media/[id]/route.ts",
    ].map(async (path) => assert.rejects(access(new URL(path, root)))),
  );
});

test("locks the complete published Avokodo presentation to repository assets", async () => {
  const {
    DEFAULT_SITE_CONTENT,
    PUBLISHED_SITE_CONTENT,
    parseSiteContent,
  } = await contentModule();

  assert.equal(DEFAULT_SITE_CONTENT, PUBLISHED_SITE_CONTENT);
  assert.doesNotThrow(() => parseSiteContent(PUBLISHED_SITE_CONTENT));
  assert.equal(PUBLISHED_SITE_CONTENT.site.name, "Avokodo");
  assert.deepEqual(PUBLISHED_SITE_CONTENT.navigation, [
    { label: "Catalog", href: "/catalog/" },
    { label: "About", href: "/about/" },
    { label: "Services", href: "/services/" },
    { label: "Work", href: "/work/" },
    { label: "Process", href: "/process/" },
    { label: "Contact", href: "/contact/" },
  ]);
  assert.match(PUBLISHED_SITE_CONTENT.hero.title, /production/i);
  assert.deepEqual(
    PUBLISHED_SITE_CONTENT.about.facts.map(({ value, label }) => [value, label]),
    [
      ["100%", "Upwork Job Success"],
      ["Top Rated", "Upwork status"],
      ["28", "Total jobs"],
      ["10+", "Years of experience"],
    ],
  );
  assert.match(
    PUBLISHED_SITE_CONTENT.about.paragraphs.join(" "),
    /5\.0 rating across 22 reviews/,
  );
  assert.deepEqual(
    PUBLISHED_SITE_CONTENT.work.items.map(({ title, image }) => [title, image?.url]),
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
    PUBLISHED_SITE_CONTENT.contact.ctaHref,
    "https://www.upwork.com/freelancers/~01fbedf6c79f177fea?viewMode=1",
  );

  const images = contentImages(PUBLISHED_SITE_CONTENT);
  assert.equal(images.length, 4);
  for (const image of images) {
    assert.match(image.url, /^\/upwork-assets\/[a-z0-9-]+\.(?:jpg|webp)$/);
    await access(new URL(`public${image.url}`, root));
  }
});

test("rejects dynamic or unapproved image paths", async () => {
  const {
    clonePublishedSiteContent,
    parseSiteContent,
    SiteContentValidationError,
  } = await contentModule();

  const managed = clonePublishedSiteContent();
  const managedId = "a48b248c-9a84-4b4f-82aa-37b8c703af39";
  managed.about.image = {
    id: managedId,
    url: `/media/${managedId}`,
    alt: "Former managed upload",
  };
  assert.throws(
    () => parseSiteContent(managed),
    (error) =>
      error instanceof SiteContentValidationError &&
      error.issues.some((issue) => issue.includes("approved bundled image")),
  );

  const unapproved = clonePublishedSiteContent();
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

  const mismatched = clonePublishedSiteContent();
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

test("keeps published content validation bounded", async () => {
  const {
    clonePublishedSiteContent,
    parseSiteContent,
    SiteContentValidationError,
  } = await contentModule();

  const tooManyFacts = clonePublishedSiteContent();
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

  const longFactValue = clonePublishedSiteContent();
  longFactValue.about.facts[0].value = "x".repeat(25);
  assert.throws(
    () => parseSiteContent(longFactValue),
    (error) =>
      error instanceof SiteContentValidationError &&
      error.issues.some((issue) => issue.includes("between 1 and 24 characters")),
  );
});

test("keeps the homepage focused while section pages retain their content", async () => {
  const { PUBLISHED_SITE_CONTENT } = await contentModule();
  const [homeHtml, aboutHtml, workHtml] = await Promise.all([
    source("out/index.html"),
    source("out/about/index.html"),
    source("out/work/index.html"),
  ]);
  const homeMarkup = homeHtml.split("<script>(self.__next_f")[0];

  assert.match(homeMarkup, /Products, designed all the way to production\./);
  assert.doesNotMatch(
    homeMarkup,
    /id="(?:catalog|about|services|work|process|contact)"/,
  );
  assert.doesNotMatch(homeMarkup, /High-end personal accessories/);
  assert.doesNotMatch(
    homeMarkup,
    /Upwork Job Success|Top Rated|PRODUCT AND FACTORY/,
  );
  assert.doesNotMatch(homeHtml, /\/api\/admin|\/media\/|signin-with-chatgpt/);

  assert.match(workHtml, /High-end personal accessories/);
  assert.match(workHtml, /Wearable product from design to manufacture/);
  assert.match(workHtml, /Phone case \+ leather/);

  for (const image of contentImages(PUBLISHED_SITE_CONTENT)) {
    const pageHtml =
      image === PUBLISHED_SITE_CONTENT.hero.image
        ? homeHtml
        : image === PUBLISHED_SITE_CONTENT.about.image
          ? aboutHtml
          : workHtml;
    assert.match(pageHtml, new RegExp(image.url.replaceAll("/", "\\/")));
    await access(new URL(`out${image.url}`, root));
  }
});

test("exports every primary navigation item as its own content page", async () => {
  const routes = {
    catalog: "PRODUCT AND FACTORY",
    about: "One connected path from design intent to manufactured detail.",
    services: "From the first line on paper to production on the floor.",
    work: "Selected products, from concept to manufacture.",
    process: "A practical route from brief to production.",
    contact: "Bring the brief. Leave with a clear product path.",
  };
  const expectedLinks = Object.keys(routes).map((route) => `href="/${route}/"`);
  const homeHtml = await source("out/index.html");

  for (const link of expectedLinks) assert.match(homeHtml, new RegExp(link));

  for (const [route, copy] of Object.entries(routes)) {
    const html = await source(`out/${route}/index.html`);

    assert.match(html, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(
      html,
      new RegExp(
        `<link rel="canonical" href="https://www\\.avokodotech\\.com/${route}/"`,
      ),
    );
    assert.doesNotMatch(html, /Products, designed all the way to production\./);
    for (const link of expectedLinks) assert.match(html, new RegExp(link));
  }
});

test("exports the Avokodo browser tab icon", async () => {
  const [homeHtml, adminHtml, notFoundHtml, sourceIcon, exportedIcon] =
    await Promise.all([
      source("out/index.html"),
      source("out/admin/index.html"),
      source("out/404.html"),
      source("app/icon.svg"),
      source("out/icon.svg"),
    ]);

  const iconLink =
    /<link rel="icon" href="\/icon\.svg(?:\?[^"]*)?" type="image\/svg\+xml" sizes="any"\/>/;

  assert.match(homeHtml, iconLink);
  assert.match(adminHtml, iconLink);
  assert.match(notFoundHtml, iconLink);
  assert.equal(exportedIcon, sourceIcon);
  assert.match(exportedIcon, /#171814/);
  assert.match(exportedIcon, /#c8ef68/);
  assert.match(exportedIcon, /#59714a/);
});
