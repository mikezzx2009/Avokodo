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

export type LocationItem = {
  id: string;
  title: string;
  location: string;
  description: string;
  mapImage: ImageRef;
  mapHref: string;
};

export type GalleryItem = {
  id: string;
  image: ImageRef;
  caption: string;
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
    gallery: GalleryItem[];
    facts: FactItem[];
    capabilities: ServiceItem[];
    materials: string[];
    process: ProcessStep[];
    locations: LocationItem[];
    closing: {
      title: string;
      description: string;
    };
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
 * The complete, production-published Avokodo presentation.
 *
 * GitHub Pages has no runtime database, so this checked-in object is the
 * authoritative content source. It uses only services, portfolio titles,
 * locations, and profile metrics visible on Avokodo's authorized Upwork
 * profile and avoids unverified client names or outcomes.
 */
export const PUBLISHED_SITE_CONTENT: SiteContent = {
  site: {
    name: "Avokodo",
    tagline: "Design it. Engineer it. Make it.",
    email: null,
  },
  navigation: [
    { label: "Catalog", href: "/catalog/" },
    { label: "About", href: "/about/" },
    { label: "Services", href: "/services/" },
    { label: "Work", href: "/work/" },
    { label: "Process", href: "/process/" },
    { label: "Contact", href: "/contact/" },
  ],
  hero: {
    eyebrow: "Industrial design · Engineering · Manufacturing",
    title: "DESIGN & MANUFACTURE SERVICE",
    description:
      "Avokodotech is a design‑and‑manufacturing company. We have in‑house design teams in Shenzhen and Xiamen, and our own manufacturing factory in Dongguan. We focus on product design and mold development, including injection molds, silicone molds and metal die‑casting. We deliver tailored services to meet clients’ every requirement.",
    primaryCta: { label: "Discuss a product", href: "/contact/" },
    secondaryCta: { label: "See selected work", href: "/work/" },
    image: {
      id: "hero-slide-teapot",
      url: "/upwork-assets/hero-slide-01-teapot.jpg",
      alt: "Floral porcelain teapot pouring into a cup",
    },
  },
  about: {
    eyebrow: "About Avokodo",
    title: "AVOKODO&SMLP",
    paragraphs: [
      "Avokodo is an integrated product design, development, and manufacturing company. Our in-house design and engineering teams operate in Xiamen and Shenzhen, supported by our own manufacturing factory in Dongguan.",
      "We connect concept development, industrial design, engineering, prototyping, material selection, tooling, manufacturing, assembly, and production coordination in one practical workflow.",
      "Our teams support OEM, ODM, and custom programs across plastic, silicone, metal hardware, and consumer electronics, with manufacturability, quality, target cost, and scalable production considered from the start.",
    ],
    image: {
      id: "about-studio-entrance",
      url: "/about-assets/studio-entrance.jpg",
      alt: "Entrance to Avokodo's connected design and manufacturing operation",
    },
    gallery: [
      {
        id: "design-office-01",
        image: {
          id: "about-design-office-01",
          url: "/about-assets/design-office-01.jpg",
          alt: "Avokodo design and engineering team working in the studio",
        },
        caption: "Design & engineering · Team workspace",
      },
      {
        id: "factory-floor-01",
        image: {
          id: "about-factory-floor-01",
          url: "/about-assets/factory-floor-01.jpg",
          alt: "Factory assembly floor with organized production workstations",
        },
        caption: "Manufacturing · Assembly floor",
      },
      {
        id: "assembly-line-products",
        image: {
          id: "about-assembly-line-products",
          url: "/about-assets/assembly-line-products.jpg",
          alt: "Finished electronic products moving through assembly",
        },
        caption: "Assembly · Production run",
      },
      {
        id: "factory-floor-02",
        image: {
          id: "about-factory-floor-02",
          url: "/about-assets/factory-floor-02.jpg",
          alt: "Factory production and storage area",
        },
        caption: "Factory · Production planning",
      },
      {
        id: "assembly-workstation",
        image: {
          id: "about-assembly-workstation",
          url: "/about-assets/assembly-workstation.jpg",
          alt: "Operator working at an Avokodo production line",
        },
        caption: "Manufacturing · In-process assembly",
      },
      {
        id: "product-inspection",
        image: {
          id: "about-product-inspection",
          url: "/about-assets/product-inspection.jpg",
          alt: "Manufactured products arranged for inspection and packing",
        },
        caption: "Quality control · Final inspection",
      },
      {
        id: "factory-floor-03",
        image: {
          id: "about-factory-floor-03",
          url: "/about-assets/factory-floor-03.jpg",
          alt: "Wide view of Avokodo's organized manufacturing floor",
        },
        caption: "Factory · Scalable production",
      },
      {
        id: "finished-components",
        image: {
          id: "about-finished-components",
          url: "/about-assets/finished-components.jpg",
          alt: "Finished metal components organized in production bins",
        },
        caption: "Components · Finishing & handling",
      },
      {
        id: "design-office-02",
        image: {
          id: "about-design-office-02",
          url: "/about-assets/design-office-02.jpg",
          alt: "Avokodo design and engineering team in the Xiamen and Shenzhen studio network",
        },
        caption: "Design & engineering · Connected teams",
      },
    ],
    facts: [
      {
        id: "design-teams",
        value: "Xiamen + Shenzhen",
        label: "Design and engineering teams",
      },
      { id: "factory", value: "Dongguan", label: "Manufacturing factory" },
      { id: "program-models", value: "OEM / ODM", label: "Flexible program models" },
      {
        id: "integrated-delivery",
        value: "Concept → Production",
        label: "Connected product delivery",
      },
    ],
    capabilities: [
      {
        id: "about-product-design",
        number: "01",
        title: "Product Design",
        description:
          "Industrial design, appearance development, structure planning, and design-for-manufacturing support.",
        capabilities: [],
      },
      {
        id: "about-engineering",
        number: "02",
        title: "Engineering & Development",
        description:
          "Mechanical engineering, prototype validation, materials, tolerances, assembly, and production engineering.",
        capabilities: [],
      },
      {
        id: "about-manufacturing",
        number: "03",
        title: "Tooling & Manufacturing",
        description:
          "Tooling development, process coordination, quality control, assembly, and scalable mass-production support.",
        capabilities: [],
      },
      {
        id: "about-supply-chain",
        number: "04",
        title: "Supply-Chain Integration",
        description:
          "Supplier coordination across plastic, silicone, metal hardware, electronics, and finished-product assembly.",
        capabilities: [],
      },
    ],
    materials: [
      "Plastic",
      "Silicone",
      "Metal hardware",
      "Consumer electronics",
      "OEM / ODM",
    ],
    process: [
      {
        id: "about-concept",
        number: "01",
        title: "Concept & Brief",
        description: "Align the opportunity, user needs, target cost, and production goals.",
      },
      {
        id: "about-industrial-design",
        number: "02",
        title: "Industrial Design",
        description: "Shape the product experience, appearance, ergonomics, and intent.",
      },
      {
        id: "about-engineering-step",
        number: "03",
        title: "Engineering",
        description: "Resolve structure, materials, tolerances, assembly, and manufacturability.",
      },
      {
        id: "about-prototype",
        number: "04",
        title: "Prototype",
        description: "Build and validate physical proofs before committing to tooling.",
      },
      {
        id: "about-tooling",
        number: "05",
        title: "Tooling",
        description: "Develop the molds, fixtures, and process controls required for production.",
      },
      {
        id: "about-mass-production",
        number: "06",
        title: "Mass Production",
        description: "Coordinate manufacturing, quality, assembly, and scalable delivery.",
      },
    ],
    locations: [
      {
        id: "xiamen",
        title: "Xiamen Team",
        location: "Xiamen · Fujian · China",
        description:
          "Product design, engineering, development, and manufacturing coordination.",
        mapImage: {
          id: "about-xiamen-location-map",
          url: "/about-assets/xiamen-location-map.png",
          alt: "Map showing the Xiamen team location",
        },
        mapHref:
          "https://www.google.com/maps/search/?api=1&query=Xiamen%2C%20Fujian%2C%20China",
      },
      {
        id: "shenzhen",
        title: "Shenzhen Team",
        location: "Shenzhen · Guangdong · China",
        description:
          "Product development, supply-chain coordination, engineering, and manufacturing support.",
        mapImage: {
          id: "about-shenzhen-location-map",
          url: "/about-assets/shenzhen-location-map.png",
          alt: "Map showing the Shenzhen team location",
        },
        mapHref:
          "https://www.google.com/maps/search/?api=1&query=Shenzhen%2C%20Guangdong%2C%20China",
      },
    ],
    closing: {
      title: "DESIGNED FOR BETTER PRODUCTS AND BETTER PRODUCTION",
      description:
        "By connecting design decisions with real manufacturing requirements, we help reduce development risk, improve communication, control cost, and move products from prototype to reliable mass production.",
    },
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
      { label: "Contact", href: "/contact/" },
    ],
    copyright: "© Avokodo. All rights reserved.",
  },
};

/**
 * Kept as a compatibility alias for presentation components while the static
 * site replaces the former CMS implementation.
 */
export const DEFAULT_SITE_CONTENT = PUBLISHED_SITE_CONTENT;

const MAX_CONTENT_BYTES = 80_000;
const ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/;
const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const BUNDLED_IMAGE_IDS = new Map<string, string>([
  ["/upwork-assets/high-end-accessories.jpg", "upwork-high-end-accessories"],
  ["/upwork-assets/wearable-product.jpg", "upwork-wearable-product"],
  ["/upwork-assets/phone-case-leather.jpg", "upwork-phone-case-leather"],
  ["/upwork-assets/brand-film.jpg", "upwork-brand-film"],
  ["/upwork-assets/hero-slide-01-teapot.jpg", "hero-slide-teapot"],
  ["/upwork-assets/hero-slide-02-camera.jpg", "hero-slide-camera"],
  ["/upwork-assets/hero-slide-03-character.jpg", "hero-slide-character"],
  ["/upwork-assets/hero-slide-04-workshop.png", "hero-slide-workshop"],
  ["/upwork-assets/broky-profile.webp", "upwork-broky-profile"],
  ["/about-assets/studio-entrance.jpg", "about-studio-entrance"],
  ["/about-assets/design-office-01.jpg", "about-design-office-01"],
  ["/about-assets/factory-floor-01.jpg", "about-factory-floor-01"],
  ["/about-assets/assembly-line-products.jpg", "about-assembly-line-products"],
  ["/about-assets/factory-floor-02.jpg", "about-factory-floor-02"],
  ["/about-assets/assembly-workstation.jpg", "about-assembly-workstation"],
  ["/about-assets/product-inspection.jpg", "about-product-inspection"],
  ["/about-assets/factory-floor-03.jpg", "about-factory-floor-03"],
  ["/about-assets/finished-components.jpg", "about-finished-components"],
  ["/about-assets/design-office-02.jpg", "about-design-office-02"],
  ["/about-assets/xiamen-location-map.png", "about-xiamen-location-map"],
  ["/about-assets/shenzhen-location-map.png", "about-shenzhen-location-map"],
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
  return clonePublishedSiteContent();
}

export function clonePublishedSiteContent(): SiteContent {
  return JSON.parse(JSON.stringify(PUBLISHED_SITE_CONTENT)) as SiteContent;
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
  exactKeys(
    value,
    [
      "eyebrow",
      "title",
      "paragraphs",
      "image",
      "gallery",
      "facts",
      "capabilities",
      "materials",
      "process",
      "locations",
      "closing",
    ],
    "about",
    issues,
  );
  const closing = objectValue(value.closing, "about.closing", issues);
  exactKeys(closing, ["title", "description"], "about.closing", issues);
  return {
    eyebrow: textValue(value.eyebrow, "about.eyebrow", 0, 100, issues),
    title: textValue(value.title, "about.title", 1, 240, issues),
    paragraphs: stringArray(value.paragraphs, "about.paragraphs", 1, 8, 1, 1_500, issues),
    image: parseNullableImage(value.image, "about.image", issues),
    gallery: arrayValue(value.gallery, "about.gallery", 1, 12, issues).map((item, index) =>
      parseGalleryItem(item, `about.gallery[${index}]`, issues),
    ),
    facts: arrayValue(value.facts, "about.facts", 1, 6, issues).map((item, index) =>
      parseFact(item, `about.facts[${index}]`, issues),
    ),
    capabilities: arrayValue(value.capabilities, "about.capabilities", 1, 8, issues).map(
      (item, index) => parseService(item, `about.capabilities[${index}]`, issues),
    ),
    materials: stringArray(value.materials, "about.materials", 1, 12, 1, 100, issues),
    process: arrayValue(value.process, "about.process", 1, 10, issues).map((item, index) =>
      parseProcessStep(item, `about.process[${index}]`, issues),
    ),
    locations: arrayValue(value.locations, "about.locations", 1, 6, issues).map(
      (item, index) => parseLocation(item, `about.locations[${index}]`, issues),
    ),
    closing: {
      title: textValue(closing.title, "about.closing.title", 1, 240, issues),
      description: textValue(
        closing.description,
        "about.closing.description",
        1,
        1_000,
        issues,
      ),
    },
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

function parseLocation(input: unknown, path: string, issues: string[]): LocationItem {
  const value = objectValue(input, path, issues);
  exactKeys(
    value,
    ["id", "title", "location", "description", "mapImage", "mapHref"],
    path,
    issues,
  );
  return {
    id: idValue(value.id, `${path}.id`, issues),
    title: textValue(value.title, `${path}.title`, 1, 140, issues),
    location: textValue(value.location, `${path}.location`, 1, 140, issues),
    description: textValue(value.description, `${path}.description`, 1, 1_000, issues),
    mapImage:
      parseNullableImage(value.mapImage, `${path}.mapImage`, issues) ?? {
        id: "invalid-location-map",
        url: "",
        alt: "Invalid location map",
      },
    mapHref: hrefValue(value.mapHref, `${path}.mapHref`, issues),
  };
}

function parseGalleryItem(input: unknown, path: string, issues: string[]): GalleryItem {
  const value = objectValue(input, path, issues);
  exactKeys(value, ["id", "image", "caption"], path, issues);
  return {
    id: idValue(value.id, `${path}.id`, issues),
    image:
      parseNullableImage(value.image, `${path}.image`, issues) ?? {
        id: "invalid-gallery-image",
        url: "",
        alt: "Invalid gallery image",
      },
    caption: textValue(value.caption, `${path}.caption`, 1, 140, issues),
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
  const bundledId = BUNDLED_IMAGE_IDS.get(url);
  const validBundledMedia = bundledId === id;
  if (!validBundledMedia) {
    issues.push(`${path}.url must be an approved bundled image and match ${path}.id`);
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
