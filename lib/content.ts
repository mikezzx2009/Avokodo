export type LinkItem = {
  label: string;
  href: string;
};

export type ImageRef = {
  id: string;
  url: string;
  alt: string;
};

export type FactItem = {
  id: string;
  value: string;
  label: string;
};

export type ServiceItem = {
  id: string;
  number: string;
  title: string;
  description: string;
  capabilities: string[];
};

export type ProjectItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: ImageRef | null;
  href: string | null;
};

export type ProcessStep = {
  id: string;
  number: string;
  title: string;
  description: string;
};

export type SiteContent = {
  site: {
    name: string;
    tagline: string;
    email: string | null;
  };
  navigation: LinkItem[];
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: LinkItem;
    secondaryCta: LinkItem | null;
    image: ImageRef | null;
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    image: ImageRef | null;
    facts: FactItem[];
  };
  services: {
    eyebrow: string;
    title: string;
    intro: string;
    items: ServiceItem[];
  };
  work: {
    eyebrow: string;
    title: string;
    intro: string;
    items: ProjectItem[];
  };
  process: {
    eyebrow: string;
    title: string;
    intro: string;
    steps: ProcessStep[];
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    email: string | null;
    ctaLabel: string;
    ctaHref: string;
  };
  footer: {
    tagline: string;
    links: LinkItem[];
    copyright: string;
  };
};

/**
 * Uses only services, portfolio titles, locations, and profile metrics visible
 * on Avokodo's authorized Upwork profile. It avoids unverified client names or
 * outcomes. It is both the initial document and the safe recovery fallback.
 */
export const DEFAULT_SITE_CONTENT: SiteContent = {
  site: {
    name: "Avokodo",
    tagline: "Design it. Engineer it. Make it.",
    email: null,
  },
  navigation: [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    eyebrow: "Industrial design · Engineering · Manufacturing",
    title: "Products, designed all the way to production.",
    description:
      "Avokodo connects product and industrial design, 3D engineering, prototyping, tooling, and manufacturing through a studio in Guangdong and Hong Kong and a factory in Dongguan.",
    primaryCta: { label: "Discuss a product", href: "#contact" },
    secondaryCta: { label: "See selected work", href: "#work" },
    image: {
      id: "upwork-brand-film",
      url: "/upwork-assets/brand-film.jpg",
      alt: "Rendered rounded product forms in white, peach, and slate blue",
    },
  },
  about: {
    eyebrow: "Studio and factory",
    title: "One connected path from design intent to manufactured detail.",
    paragraphs: [
      "Avokodo is a design studio in Guangdong and Hong Kong with a factory in Dongguan, bringing product design and manufacturing into one practical workflow.",
      "The authorized Upwork profile records 10+ years of experience, Top Rated status, 100% Job Success, a 5.0 rating across 22 reviews, and 28 total jobs.",
    ],
    image: null,
    facts: [
      { id: "job-success", value: "100%", label: "Upwork Job Success" },
      { id: "upwork-status", value: "Top Rated", label: "Upwork status" },
      { id: "total-jobs", value: "28", label: "Total jobs" },
      { id: "experience", value: "10+", label: "Years of experience" },
    ],
  },
  services: {
    eyebrow: "Capabilities",
    title: "From the first line on paper to production on the floor.",
    intro:
      "Choose a focused design engagement or connect the full product-development path through one team.",
    items: [
      {
        id: "product-design",
        number: "01",
        title: "Product & industrial design",
        description:
          "Turn a brief into clear product concepts, balancing form, function, user needs, materials, and production intent.",
        capabilities: ["Concept design", "Sketching", "Technical drawing", "Industrial design"],
      },
      {
        id: "3d-engineering",
        number: "02",
        title: "3D modeling & rendering",
        description:
          "Develop precise 3D models and persuasive visualizations for design review, engineering, and manufacturing handoff.",
        capabilities: ["SolidWorks", "UG", "Pro/E", "CAD", "Blender", "Rhino", "KeyShot"],
      },
      {
        id: "prototyping-tooling",
        number: "03",
        title: "Prototyping & tooling",
        description:
          "Move from digital model to physical proof, then prepare the molds and fabrication route required for production.",
        capabilities: [
          "3D printing",
          "Prototyping",
          "Injection molds",
          "Silicone molds",
          "Metal die casting",
          "Tooling & fabrication",
        ],
      },
      {
        id: "manufacturing",
        number: "04",
        title: "ODM, OEM & manufacturing",
        description:
          "Carry an approved product into manufacturing with the design, engineering, tooling, and factory stages connected.",
        capabilities: ["ODM", "OEM", "Manufacturing", "Production handoff"],
      },
    ],
  },
  work: {
    eyebrow: "Portfolio",
    title: "Selected products, from concept to manufacture.",
    intro:
      "Three examples from the visible Avokodo portfolio, spanning early form development, 3D product engineering, and manufactured finishes.",
    items: [
      {
        id: "high-end-accessories",
        title: "High-end personal accessories",
        category: "Concept sketch · Industrial design",
        description:
          "An early form study translating dimensions and ergonomics into a clear product direction.",
        image: {
          id: "upwork-high-end-accessories",
          url: "/upwork-assets/high-end-accessories.jpg",
          alt: "Dimensioned hand sketch for a curved personal accessory",
        },
        href: "https://www.upwork.com/freelancers/~01fbedf6c79f177fea?viewMode=1",
      },
      {
        id: "wearable-product",
        title: "Wearable product from design to manufacture",
        category: "3D modeling · Design for manufacturing",
        description:
          "A wearable concept developed through 3D form, fit, engineering, and preparation for manufacture.",
        image: {
          id: "upwork-wearable-product",
          url: "/upwork-assets/wearable-product.jpg",
          alt: "Blue 3D rendering of two circular wearable product components",
        },
        href: "https://www.upwork.com/freelancers/~01fbedf6c79f177fea?viewMode=1",
      },
      {
        id: "phone-case-leather",
        title: "Phone case + leather",
        category: "Product development · Manufacturing",
        description:
          "A phone-case structure paired with a leather finish and shown as a physical production sample.",
        image: {
          id: "upwork-phone-case-leather",
          url: "/upwork-assets/phone-case-leather.jpg",
          alt: "Black phone-case camera surround held above leather-finished cases",
        },
        href: "https://www.upwork.com/freelancers/~01fbedf6c79f177fea?viewMode=1",
      },
    ],
  },
  process: {
    eyebrow: "Product path",
    title: "A practical route from brief to production.",
    intro:
      "The scope can begin at any stage, or continue as one connected design-and-manufacturing engagement.",
    steps: [
      {
        id: "brief-concept",
        number: "01",
        title: "Brief & concept",
        description: "Define product requirements, explore ideas, and establish a design direction.",
      },
      {
        id: "design-engineer",
        number: "02",
        title: "Design & engineer",
        description: "Resolve form and function through sketches, technical drawings, and 3D models.",
      },
      {
        id: "prototype-validate",
        number: "03",
        title: "Prototype & validate",
        description: "Use 3D printing and physical prototypes to review fit, feel, and production details.",
      },
      {
        id: "tool-manufacture",
        number: "04",
        title: "Tool & manufacture",
        description: "Prepare molds or fabrication, then move the approved product into manufacturing.",
      },
    ],
  },
  contact: {
    eyebrow: "Start on Upwork",
    title: "Bring the brief. Leave with a clear product path.",
    description:
      "Share the product idea, target material, quantity, and timing. Avokodo can help identify the right next step, from design through manufacturing.",
    email: null,
    ctaLabel: "View profile & start a conversation",
    ctaHref:
      "https://www.upwork.com/freelancers/~01fbedf6c79f177fea?viewMode=1",
  },
  footer: {
    tagline: "Product design and manufacturing, connected.",
    links: [
      { label: "Back to top", href: "#top" },
      { label: "Contact", href: "#contact" },
    ],
    copyright: "© Avokodo. All rights reserved.",
  },
};

const MAX_CONTENT_BYTES = 80_000;
const ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/;
const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const MEDIA_URL_PATTERN = /^\/media\/([a-f0-9-]{16,64})$/i;
const BUNDLED_IMAGE_IDS = new Map<string, string>([
  ["/upwork-assets/high-end-accessories.jpg", "upwork-high-end-accessories"],
  ["/upwork-assets/wearable-product.jpg", "upwork-wearable-product"],
  ["/upwork-assets/phone-case-leather.jpg", "upwork-phone-case-leather"],
  ["/upwork-assets/brand-film.jpg", "upwork-brand-film"],
  ["/upwork-assets/broky-profile.webp", "upwork-broky-profile"],
]);

export class SiteContentValidationError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(issues[0] ?? "Invalid site content");
    this.name = "SiteContentValidationError";
    this.issues = issues;
  }
}

export function parseSiteContent(input: unknown): SiteContent {
  const serialized = safeStringify(input);
  if (serialized.length > MAX_CONTENT_BYTES) {
    throw new SiteContentValidationError([
      `content exceeds the ${MAX_CONTENT_BYTES.toLocaleString()} character limit`,
    ]);
  }

  const issues: string[] = [];
  const root = objectValue(input, "content", issues);
  exactKeys(
    root,
    ["site", "navigation", "hero", "about", "services", "work", "process", "contact", "footer"],
    "content",
    issues,
  );

  const content: SiteContent = {
    site: parseSite(root.site, issues),
    navigation: arrayValue(root.navigation, "navigation", 0, 12, issues).map((item, index) =>
      parseLink(item, `navigation[${index}]`, issues),
    ),
    hero: parseHero(root.hero, issues),
    about: parseAbout(root.about, issues),
    services: parseServices(root.services, issues),
    work: parseWork(root.work, issues),
    process: parseProcess(root.process, issues),
    contact: parseContact(root.contact, issues),
    footer: parseFooter(root.footer, issues),
  };

  if (issues.length > 0) throw new SiteContentValidationError(issues.slice(0, 30));
  return content;
}

export function cloneDefaultSiteContent(): SiteContent {
  return JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT)) as SiteContent;
}

function parseSite(input: unknown, issues: string[]): SiteContent["site"] {
  const value = objectValue(input, "site", issues);
  exactKeys(value, ["name", "tagline", "email"], "site", issues);
  return {
    name: textValue(value.name, "site.name", 1, 80, issues),
    tagline: textValue(value.tagline, "site.tagline", 1, 200, issues),
    email: nullableEmailValue(value.email, "site.email", issues),
  };
}

function parseHero(input: unknown, issues: string[]): SiteContent["hero"] {
  const value = objectValue(input, "hero", issues);
  exactKeys(
    value,
    ["eyebrow", "title", "description", "primaryCta", "secondaryCta", "image"],
    "hero",
    issues,
  );
  return {
    eyebrow: textValue(value.eyebrow, "hero.eyebrow", 0, 100, issues),
    title: textValue(value.title, "hero.title", 1, 240, issues),
    description: textValue(value.description, "hero.description", 1, 1_000, issues),
    primaryCta: parseLink(value.primaryCta, "hero.primaryCta", issues),
    secondaryCta:
      value.secondaryCta === null
        ? null
        : parseLink(value.secondaryCta, "hero.secondaryCta", issues),
    image: parseNullableImage(value.image, "hero.image", issues),
  };
}

function parseAbout(input: unknown, issues: string[]): SiteContent["about"] {
  const value = objectValue(input, "about", issues);
  exactKeys(value, ["eyebrow", "title", "paragraphs", "image", "facts"], "about", issues);
  return {
    eyebrow: textValue(value.eyebrow, "about.eyebrow", 0, 100, issues),
    title: textValue(value.title, "about.title", 1, 240, issues),
    paragraphs: stringArray(value.paragraphs, "about.paragraphs", 1, 8, 1, 1_500, issues),
    image: parseNullableImage(value.image, "about.image", issues),
    facts: arrayValue(value.facts, "about.facts", 1, 6, issues).map((item, index) =>
      parseFact(item, `about.facts[${index}]`, issues),
    ),
  };
}

function parseFact(input: unknown, path: string, issues: string[]): FactItem {
  const value = objectValue(input, path, issues);
  exactKeys(value, ["id", "value", "label"], path, issues);
  return {
    id: idValue(value.id, `${path}.id`, issues),
    value: textValue(value.value, `${path}.value`, 1, 24, issues),
    label: textValue(value.label, `${path}.label`, 1, 100, issues),
  };
}

function parseServices(input: unknown, issues: string[]): SiteContent["services"] {
  const value = objectValue(input, "services", issues);
  exactKeys(value, ["eyebrow", "title", "intro", "items"], "services", issues);
  return {
    eyebrow: textValue(value.eyebrow, "services.eyebrow", 0, 100, issues),
    title: textValue(value.title, "services.title", 1, 240, issues),
    intro: textValue(value.intro, "services.intro", 0, 1_000, issues),
    items: arrayValue(value.items, "services.items", 1, 12, issues).map((item, index) =>
      parseService(item, `services.items[${index}]`, issues),
    ),
  };
}

function parseService(input: unknown, path: string, issues: string[]): ServiceItem {
  const value = objectValue(input, path, issues);
  exactKeys(value, ["id", "number", "title", "description", "capabilities"], path, issues);
  return {
    id: idValue(value.id, `${path}.id`, issues),
    number: textValue(value.number, `${path}.number`, 1, 12, issues),
    title: textValue(value.title, `${path}.title`, 1, 140, issues),
    description: textValue(value.description, `${path}.description`, 1, 1_000, issues),
    capabilities: stringArray(
      value.capabilities,
      `${path}.capabilities`,
      0,
      12,
      1,
      100,
      issues,
    ),
  };
}

function parseWork(input: unknown, issues: string[]): SiteContent["work"] {
  const value = objectValue(input, "work", issues);
  exactKeys(value, ["eyebrow", "title", "intro", "items"], "work", issues);
  return {
    eyebrow: textValue(value.eyebrow, "work.eyebrow", 0, 100, issues),
    title: textValue(value.title, "work.title", 1, 240, issues),
    intro: textValue(value.intro, "work.intro", 0, 1_000, issues),
    items: arrayValue(value.items, "work.items", 0, 16, issues).map((item, index) =>
      parseProject(item, `work.items[${index}]`, issues),
    ),
  };
}

function parseProject(input: unknown, path: string, issues: string[]): ProjectItem {
  const value = objectValue(input, path, issues);
  exactKeys(value, ["id", "title", "category", "description", "image", "href"], path, issues);
  return {
    id: idValue(value.id, `${path}.id`, issues),
    title: textValue(value.title, `${path}.title`, 1, 160, issues),
    category: textValue(value.category, `${path}.category`, 1, 100, issues),
    description: textValue(value.description, `${path}.description`, 1, 1_200, issues),
    image: parseNullableImage(value.image, `${path}.image`, issues),
    href: value.href === null ? null : hrefValue(value.href, `${path}.href`, issues),
  };
}

function parseProcess(input: unknown, issues: string[]): SiteContent["process"] {
  const value = objectValue(input, "process", issues);
  exactKeys(value, ["eyebrow", "title", "intro", "steps"], "process", issues);
  return {
    eyebrow: textValue(value.eyebrow, "process.eyebrow", 0, 100, issues),
    title: textValue(value.title, "process.title", 1, 240, issues),
    intro: textValue(value.intro, "process.intro", 0, 1_000, issues),
    steps: arrayValue(value.steps, "process.steps", 1, 10, issues).map((item, index) =>
      parseProcessStep(item, `process.steps[${index}]`, issues),
    ),
  };
}

function parseProcessStep(input: unknown, path: string, issues: string[]): ProcessStep {
  const value = objectValue(input, path, issues);
  exactKeys(value, ["id", "number", "title", "description"], path, issues);
  return {
    id: idValue(value.id, `${path}.id`, issues),
    number: textValue(value.number, `${path}.number`, 1, 12, issues),
    title: textValue(value.title, `${path}.title`, 1, 140, issues),
    description: textValue(value.description, `${path}.description`, 1, 800, issues),
  };
}

function parseContact(input: unknown, issues: string[]): SiteContent["contact"] {
  const value = objectValue(input, "contact", issues);
  exactKeys(
    value,
    ["eyebrow", "title", "description", "email", "ctaLabel", "ctaHref"],
    "contact",
    issues,
  );
  return {
    eyebrow: textValue(value.eyebrow, "contact.eyebrow", 0, 100, issues),
    title: textValue(value.title, "contact.title", 1, 240, issues),
    description: textValue(value.description, "contact.description", 1, 1_000, issues),
    email: nullableEmailValue(value.email, "contact.email", issues),
    ctaLabel: textValue(value.ctaLabel, "contact.ctaLabel", 1, 100, issues),
    ctaHref: hrefValue(value.ctaHref, "contact.ctaHref", issues),
  };
}

function parseFooter(input: unknown, issues: string[]): SiteContent["footer"] {
  const value = objectValue(input, "footer", issues);
  exactKeys(value, ["tagline", "links", "copyright"], "footer", issues);
  return {
    tagline: textValue(value.tagline, "footer.tagline", 1, 240, issues),
    links: arrayValue(value.links, "footer.links", 0, 12, issues).map((item, index) =>
      parseLink(item, `footer.links[${index}]`, issues),
    ),
    copyright: textValue(value.copyright, "footer.copyright", 1, 200, issues),
  };
}

function parseLink(input: unknown, path: string, issues: string[]): LinkItem {
  const value = objectValue(input, path, issues);
  exactKeys(value, ["label", "href"], path, issues);
  return {
    label: textValue(value.label, `${path}.label`, 1, 100, issues),
    href: hrefValue(value.href, `${path}.href`, issues),
  };
}

function parseNullableImage(input: unknown, path: string, issues: string[]): ImageRef | null {
  if (input === null) return null;
  const value = objectValue(input, path, issues);
  exactKeys(value, ["id", "url", "alt"], path, issues);
  const id = textValue(value.id, `${path}.id`, 16, 64, issues);
  const url = textValue(value.url, `${path}.url`, 1, 100, issues);
  const match = MEDIA_URL_PATTERN.exec(url);
  const bundledId = BUNDLED_IMAGE_IDS.get(url);
  const validUploadedMedia = Boolean(match && match[1] === id);
  const validBundledMedia = bundledId === id;
  if (!validUploadedMedia && !validBundledMedia) {
    issues.push(
      `${path}.url must be an approved bundled image or /media/{id}, and match ${path}.id`,
    );
  }
  return {
    id,
    url,
    alt: textValue(value.alt, `${path}.alt`, 1, 300, issues),
  };
}

function objectValue(input: unknown, path: string, issues: string[]): Record<string, unknown> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    issues.push(`${path} must be an object`);
    return {};
  }
  return input as Record<string, unknown>;
}

function exactKeys(
  value: Record<string, unknown>,
  expected: string[],
  path: string,
  issues: string[],
) {
  const expectedSet = new Set(expected);
  for (const key of Object.keys(value)) {
    if (!expectedSet.has(key)) issues.push(`${path}.${key} is not allowed`);
  }
  for (const key of expected) {
    if (!(key in value)) issues.push(`${path}.${key} is required`);
  }
}

function arrayValue(
  input: unknown,
  path: string,
  min: number,
  max: number,
  issues: string[],
): unknown[] {
  if (!Array.isArray(input)) {
    issues.push(`${path} must be an array`);
    return [];
  }
  if (input.length < min || input.length > max) {
    issues.push(`${path} must contain between ${min} and ${max} items`);
  }
  return input.slice(0, max);
}

function stringArray(
  input: unknown,
  path: string,
  minItems: number,
  maxItems: number,
  minLength: number,
  maxLength: number,
  issues: string[],
): string[] {
  return arrayValue(input, path, minItems, maxItems, issues).map((item, index) =>
    textValue(item, `${path}[${index}]`, minLength, maxLength, issues),
  );
}

function textValue(
  input: unknown,
  path: string,
  min: number,
  max: number,
  issues: string[],
): string {
  if (typeof input !== "string") {
    issues.push(`${path} must be a string`);
    return "";
  }
  const value = input.trim();
  if (value.length < min || value.length > max) {
    issues.push(`${path} must be between ${min} and ${max} characters`);
  }
  if (value.includes("<") || value.includes(">")) {
    issues.push(`${path} must be plain text without HTML`);
  }
  if (hasUnsupportedControlCharacter(value)) {
    issues.push(`${path} contains unsupported control characters`);
  }
  return value;
}

function idValue(input: unknown, path: string, issues: string[]): string {
  const value = textValue(input, path, 1, 64, issues);
  if (!ID_PATTERN.test(value)) {
    issues.push(`${path} must use lowercase letters, numbers, hyphens, or underscores`);
  }
  return value;
}

function emailValue(input: unknown, path: string, issues: string[]): string {
  const value = textValue(input, path, 3, 254, issues);
  if (!EMAIL_PATTERN.test(value)) issues.push(`${path} must be a valid email address`);
  return value;
}

function nullableEmailValue(input: unknown, path: string, issues: string[]): string | null {
  if (input === null) return null;
  return emailValue(input, path, issues);
}

function hrefValue(input: unknown, path: string, issues: string[]): string {
  const value = textValue(input, path, 1, 500, issues);
  const validAnchor = /^#[a-zA-Z][\w-]*$/.test(value);
  const validRelative = /^\/(?!\/)[^\s<>]*$/.test(value);
  const validMailto = /^mailto:[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/i.test(value);
  let validHttps = false;
  try {
    const url = new URL(value);
    validHttps = url.protocol === "https:" && !url.username && !url.password;
  } catch {
    validHttps = false;
  }
  if (!validAnchor && !validRelative && !validMailto && !validHttps) {
    issues.push(`${path} must be an anchor, same-site path, mailto link, or HTTPS URL`);
  }
  return value;
}

function safeStringify(input: unknown): string {
  try {
    return JSON.stringify(input) ?? "";
  } catch {
    throw new SiteContentValidationError(["content must be JSON serializable"]);
  }
}

function hasUnsupportedControlCharacter(value: string): boolean {
  for (const character of value) {
    const code = character.charCodeAt(0);
    if ((code < 32 && code !== 9 && code !== 10 && code !== 13) || code === 127) {
      return true;
    }
  }
  return false;
}
