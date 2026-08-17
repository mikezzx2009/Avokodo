export type LinkItem = {
  label: string;
  href: string;
};

export type ImageRef = {
  id: string;
  url: string;
  alt: string;
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
 * Deliberately avoids client names, project outcomes, awards, headcount, and
 * other claims that have not been verified by Avokodo. It is both the first
 * published document and the recovery fallback if stored content is invalid.
 */
export const DEFAULT_SITE_CONTENT: SiteContent = {
  site: {
    name: "Avokodo",
    tagline: "Thoughtful digital products, made to work.",
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
    eyebrow: "Independent digital studio",
    title: "We turn complex product ideas into clear, useful experiences.",
    description:
      "Avokodo brings product thinking, interface design, and hands-on development into one focused process.",
    primaryCta: { label: "Start a conversation", href: "#contact" },
    secondaryCta: { label: "Explore our approach", href: "#process" },
    image: null,
  },
  about: {
    eyebrow: "About Avokodo",
    title: "A close creative partnership from first question to final detail.",
    paragraphs: [
      "Avokodo is an independent studio for founders and product teams who want to bring structure to ambitious digital ideas.",
      "The studio connects strategy, design, and implementation so each stage can move in one clear direction.",
    ],
    image: null,
  },
  services: {
    eyebrow: "What we do",
    title: "The thinking and craft a digital product needs.",
    intro:
      "Engagements are shaped around the problem, with a practical mix of product, design, and development work.",
    items: [
      {
        id: "product-direction",
        number: "01",
        title: "Product direction",
        description:
          "Clarify the opportunity, audience, priorities, and path from idea to a focused product brief.",
        capabilities: ["Discovery", "Product strategy", "Experience mapping"],
      },
      {
        id: "experience-design",
        number: "02",
        title: "Experience design",
        description:
          "Shape intuitive flows and distinctive interfaces that make complex products easier to understand and use.",
        capabilities: ["UX design", "UI design", "Prototyping", "Design systems"],
      },
      {
        id: "digital-build",
        number: "03",
        title: "Digital build",
        description:
          "Translate approved ideas into responsive, maintainable web experiences with care for performance and detail.",
        capabilities: ["Web development", "Responsive implementation", "Quality assurance"],
      },
    ],
  },
  work: {
    eyebrow: "Selected work",
    title: "Work worth explaining properly.",
    intro:
      "This section is ready for project stories Avokodo chooses to publish. For verified work history, visit the Avokodo profile linked below.",
    items: [],
  },
  process: {
    eyebrow: "How we work",
    title: "A direct process, with room to think.",
    intro:
      "Each stage creates a clear decision point, keeping momentum without skipping the questions that matter.",
    steps: [
      {
        id: "discover",
        number: "01",
        title: "Discover",
        description: "Understand the context, the audience, and what success needs to mean.",
      },
      {
        id: "define",
        number: "02",
        title: "Define",
        description: "Turn what we learn into priorities, structure, and a shared direction.",
      },
      {
        id: "make",
        number: "03",
        title: "Make",
        description: "Design, prototype, and build the experience in focused, reviewable steps.",
      },
      {
        id: "refine",
        number: "04",
        title: "Refine",
        description: "Test the details, resolve the rough edges, and prepare the work to go live.",
      },
    ],
  },
  contact: {
    eyebrow: "Start a project",
    title: "Have a digital product in mind? Let’s make it clearer.",
    description:
      "Share what you are building, where you are stuck, and what you would like to change.",
    email: null,
    ctaLabel: "View the Avokodo profile",
    ctaHref:
      "https://www.upwork.com/freelancers/~01fbedf6c79f177fea?viewMode=1",
  },
  footer: {
    tagline: "Thoughtful digital products, made to work.",
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
  exactKeys(value, ["eyebrow", "title", "paragraphs", "image"], "about", issues);
  return {
    eyebrow: textValue(value.eyebrow, "about.eyebrow", 0, 100, issues),
    title: textValue(value.title, "about.title", 1, 240, issues),
    paragraphs: stringArray(value.paragraphs, "about.paragraphs", 1, 8, 1, 1_500, issues),
    image: parseNullableImage(value.image, "about.image", issues),
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
  if (!match || match[1] !== id) {
    issues.push(`${path}.url must be /media/{id} and match ${path}.id`);
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
