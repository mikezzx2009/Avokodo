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

async function catalogManifest() {
  return JSON.parse(await source("lib/catalog-data.json"));
}

function contentImages(content) {
  return [
    content.hero.image,
    content.about.image,
    ...content.about.gallery.map((item) => item.image),
    ...content.about.locations.map((item) => item.mapImage),
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
  assert.equal(PUBLISHED_SITE_CONTENT.hero.title, "DESIGN & MANUFACTURE SERVICE");
  assert.deepEqual(PUBLISHED_SITE_CONTENT.hero.image, {
    id: "hero-slide-teapot",
    url: "/upwork-assets/hero-slide-01-teapot.jpg",
    alt: "Floral porcelain teapot pouring into a cup",
  });
  assert.deepEqual(
    PUBLISHED_SITE_CONTENT.about.facts.map(({ value, label }) => [value, label]),
    [
      ["Xiamen + Shenzhen", "Design and engineering teams"],
      ["Dongguan", "Manufacturing factory"],
      ["OEM / ODM", "Flexible program models"],
      ["Concept → Production", "Connected product delivery"],
    ],
  );
  assert.match(
    PUBLISHED_SITE_CONTENT.about.storySections
      .flatMap(({ paragraphs }) => paragraphs)
      .join(" "),
    /plastic, silicone, metal hardware, and consumer electronics/,
  );
  assert.equal(PUBLISHED_SITE_CONTENT.about.introTitle, "From Concept to Production");
  assert.deepEqual(
    PUBLISHED_SITE_CONTENT.about.storySections.map(({ title }) => title),
    [
      "Integrated Product Design & Development",
      "Materials & Manufacturing Capabilities",
      "OEM, ODM & Custom Product Programs",
      "Design for Manufacturing",
      "From Prototype to Mass Production",
      "Xiamen · Shenzhen · Dongguan",
      "Building Products That Can Be Made",
    ],
  );
  assert.equal(PUBLISHED_SITE_CONTENT.about.gallery.length, 9);
  assert.equal(
    PUBLISHED_SITE_CONTENT.about.image.url,
    "/about-assets/studio-entrance.jpg",
  );
  assert.deepEqual(
    PUBLISHED_SITE_CONTENT.about.capabilities.map(({ title }) => title),
    [
      "Product Design",
      "Engineering & Development",
      "Tooling & Manufacturing",
      "Supply-Chain Integration",
    ],
  );
  assert.deepEqual(
    PUBLISHED_SITE_CONTENT.about.process.map(({ title }) => title),
    [
      "Concept & Brief",
      "Industrial Design",
      "Engineering",
      "Prototype",
      "Tooling",
      "Mass Production",
    ],
  );
  assert.deepEqual(
    PUBLISHED_SITE_CONTENT.about.locations.map(({ title, location }) => [title, location]),
    [
      ["Xiamen Team", "Xiamen · Fujian · China"],
      ["Shenzhen Team", "Shenzhen · Guangdong · China"],
    ],
  );
  assert.deepEqual(
    PUBLISHED_SITE_CONTENT.about.locations.map(({ mapHref }) => mapHref),
    [
      "https://www.google.com/maps/search/?api=1&query=Xiamen%2C%20Fujian%2C%20China",
      "https://www.google.com/maps/search/?api=1&query=Shenzhen%2C%20Guangdong%2C%20China",
    ],
  );
  assert.deepEqual(
    PUBLISHED_SITE_CONTENT.about.locations.map(({ mapImage }) => mapImage.url),
    [
      "/about-assets/xiamen-location-map.png",
      "/about-assets/shenzhen-location-map.png",
    ],
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
  assert.equal(images.length, 16);
  for (const image of images) {
    assert.match(image.url, /^\/(?:upwork-assets|about-assets)\/[a-z0-9-]+\.(?:jpg|png|webp)$/);
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

  assert.match(homeMarkup, /DESIGN &amp; MANUFACTURE SERVICE/);
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

  assert.match(aboutHtml, /AVOKODO&amp;SMLP/);
  assert.match(aboutHtml, /From Concept to Production/);
  assert.match(aboutHtml, /Integrated Product Design &amp; Development/);
  assert.match(aboutHtml, /Building Products That Can Be Made/);
  assert.match(aboutHtml, /Avokodo — turning ideas into products built for real-world production/);
  assert.match(aboutHtml, /DEVELOPMENT FOR MANUFACTURING/);
  assert.match(aboutHtml, /Materials &amp; program types/);
  assert.match(aboutHtml, /TWO TEAMS &amp; ONE CONNECTED OPERATION/);
  assert.match(aboutHtml, /PROTOTYPE&amp;MASS PRODUCTION/);
  assert.match(aboutHtml, /ONE STOP SERIVCE/);
  assert.match(aboutHtml, /DESIGNED FOR BETTER PRODUCTS AND BETTER PRODUCTION/);
  assert.match(aboutHtml, /Inside Avokodo/);
  assert.match(aboutHtml, /Open in Google Maps/);
  assert.match(
    aboutHtml,
    /https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=Xiamen%2C%20Fujian%2C%20China/,
  );
  assert.match(
    aboutHtml,
    /https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=Shenzhen%2C%20Guangdong%2C%20China/,
  );

  for (const image of contentImages(PUBLISHED_SITE_CONTENT)) {
    const aboutImages = new Set([
      PUBLISHED_SITE_CONTENT.about.image,
      ...PUBLISHED_SITE_CONTENT.about.gallery.map((item) => item.image),
      ...PUBLISHED_SITE_CONTENT.about.locations.map((item) => item.mapImage),
    ]);
    const pageHtml =
      image === PUBLISHED_SITE_CONTENT.hero.image
        ? homeHtml
        : aboutImages.has(image)
          ? aboutHtml
          : workHtml;
    assert.match(pageHtml, new RegExp(image.url.replaceAll("/", "\\/")));
    await access(new URL(`out${image.url}`, root));
  }
});

test("renders the ordered homepage slideshow with motion safeguards", async () => {
  const [homeHtml, slideshow, siteCss] = await Promise.all([
    source("out/index.html"),
    source("app/HeroSlideshow.tsx"),
    source("app/site.css"),
  ]);
  const slidePaths = [
    "/upwork-assets/hero-slide-01-teapot.jpg",
    "/upwork-assets/hero-slide-02-camera.jpg",
    "/upwork-assets/hero-slide-03-character.jpg",
    "/upwork-assets/hero-slide-04-workshop.png",
  ];
  let previousIndex = -1;

  for (const slidePath of slidePaths) {
    const slideIndex = homeHtml.indexOf(slidePath);
    assert.ok(slideIndex > previousIndex, `${slidePath} should follow the requested order`);
    previousIndex = slideIndex;
    await access(new URL(`public${slidePath}`, root));
    await access(new URL(`out${slidePath}`, root));
  }

  assert.match(homeHtml, /aria-roledescription="carousel"/);
  assert.match(homeHtml, /Avokodo 3D renderings/);
  assert.match(homeHtml, /aria-label="Stop slide rotation"/);
  assert.match(slideshow, /Start slide rotation/);
  assert.doesNotMatch(slideshow, /aria-pressed/);
  assert.match(homeHtml, /aria-label="Previous slide"/);
  assert.match(homeHtml, /aria-label="Next slide"/);
  assert.equal((homeHtml.match(/aria-roledescription="slide"/g) ?? []).length, 4);
  assert.match(slideshow, /SLIDE_INTERVAL_MS = 4_000/);
  assert.match(slideshow, /prefers-reduced-motion: reduce/);
  assert.match(slideshow, /reducedMotion\.matches/);
  assert.match(slideshow, /clearInterval/);
  assert.match(slideshow, /visibilitychange/);
  assert.match(slideshow, /onFocusCapture/);
  assert.match(slideshow, /onMouseEnter/);
  assert.match(siteCss, /transition:\s*opacity 800ms ease/);
  assert.match(siteCss, /object-fit:\s*contain/);
});

test("exports every primary navigation item as its own content page", async () => {
  const routes = {
    catalog: "Browse the material library by folder.",
    about: "AVOKODO&amp;SMLP",
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
    assert.doesNotMatch(html, /DESIGN &amp; MANUFACTURE SERVICE/);
    for (const link of expectedLinks) assert.match(html, new RegExp(link));
  }
});

test("keeps standalone pages free of oversized navigation gaps", async () => {
  const [siteCss, homeHtml] = await Promise.all([
    source("app/site.css"),
    source("out/index.html"),
  ]);
  const flushRoutes = ["catalog", "services", "work", "process"];
  const compactRoutes = ["about", "contact"];

  assert.match(
    siteCss,
    /\.avk-page-main\s*>\s*\.avk-page-section--flush\s*{[^}]*padding-top:\s*0;/s,
  );
  assert.match(
    siteCss,
    /\.avk-page-main\s*>\s*\.avk-page-section--compact\s*{[^}]*padding-top:\s*clamp\(1\.5rem,\s*2\.5vw,\s*2\.5rem\);/s,
  );

  for (const route of flushRoutes) {
    const html = await source(`out/${route}/index.html`);
    assert.match(html, /avk-page-section--flush/);
    assert.doesNotMatch(html, /avk-page-section--compact/);
  }

  for (const route of compactRoutes) {
    const html = await source(`out/${route}/index.html`);
    assert.match(html, /avk-page-section--compact/);
    assert.doesNotMatch(html, /avk-page-section--flush/);
  }

  const catalogDetailHtml = await source("out/catalog/3d-print/index.html");
  assert.match(catalogDetailHtml, /avk-page-section--compact/);
  assert.doesNotMatch(catalogDetailHtml, /avk-page-section--flush/);
  assert.doesNotMatch(homeHtml, /avk-page-section--(?:flush|compact)/);
});

test("uses one centered title system across every public page", async () => {
  const [siteCss, { categories }] = await Promise.all([
    source("app/site.css"),
    catalogManifest(),
  ]);
  const routes = [
    ["out/index.html", "hero-title"],
    ["out/catalog/index.html", "catalog-title"],
    ["out/about/index.html", "about-title"],
    ["out/services/index.html", "services-title"],
    ["out/work/index.html", "work-title"],
    ["out/process/index.html", "process-title"],
    ["out/contact/index.html", "contact-title"],
    ...categories.map((category) => [
      `out/catalog/${category.slug}/index.html`,
      "catalog-title",
    ]),
  ];

  assert.match(
    siteCss,
    /\.avk-site\s+\.avk-page-title\s*{[^}]*font-size:\s*clamp\(3\.25rem,\s*6vw,\s*6\.5rem\);[^}]*text-align:\s*center;/s,
  );

  for (const [path, titleId] of routes) {
    const html = (await source(path)).split("<script>(self.__next_f")[0];
    const titleTag = html.match(
      new RegExp(
        `<h[12](?=[^>]*\\bid="${titleId}")(?=[^>]*\\bclass="[^"]*\\bavk-page-title(?:\\s|\\b)[^"]*")[^>]*>`,
      ),
    )?.[0];

    assert.ok(titleTag, `${path} should expose ${titleId} as an avk-page-title`);
    assert.doesNotMatch(titleTag, /\sstyle=/);
  }
});

test("exports every factory-material folder as a complete catalog page", async () => {
  const { categories } = await catalogManifest();
  const catalogHtml = await source("out/catalog/index.html");
  const printCategory = categories.find((category) => category.slug === "3d-print");

  assert.equal(categories.length, 11);
  assert.equal(
    categories.reduce((total, category) => total + category.imageCount, 0),
    238,
  );
  assert.equal(
    categories.reduce((total, category) => total + category.videoCount, 0),
    11,
  );
  assert.equal(
    printCategory.groups.find((group) => group.slug === "product").imageCount,
    7,
  );
  assert.equal(
    printCategory.groups.find((group) => group.slug === "factory").imageCount,
    5,
  );

  for (const category of categories) {
    const routeHref = `/catalog/${category.slug}/`;
    const detailHtml = await source(`out/catalog/${category.slug}/index.html`);

    assert.match(catalogHtml, new RegExp(`href="${routeHref}"`));
    assert.match(detailHtml, new RegExp(category.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(
      detailHtml,
      new RegExp(
        `<link rel="canonical" href="https://www\\.avokodotech\\.com${routeHref}"`,
      ),
    );

    for (const group of category.groups) {
      assert.match(
        detailHtml,
        new RegExp(group.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      );

      for (const media of group.media) {
        const escapedPath = media.src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        assert.match(detailHtml, new RegExp(escapedPath));
        await access(new URL(`public${media.src}`, root));
        await access(new URL(`out${media.src}`, root));
      }
    }
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
    /<link (?=[^>]*rel="icon")(?=[^>]*href="\/icon\.svg(?:\?[^"]*)?")(?=[^>]*type="image\/svg\+xml")(?=[^>]*sizes="any")[^>]*\/>/;

  assert.match(homeHtml, iconLink);
  assert.match(adminHtml, iconLink);
  assert.match(notFoundHtml, iconLink);
  assert.equal(exportedIcon, sourceIcon);
  assert.match(exportedIcon, /#171814/);
  assert.match(exportedIcon, /#c8ef68/);
  assert.match(exportedIcon, /#59714a/);
});
