import catalogData from "./catalog-data.json";

export type CatalogMedia = {
  kind: "image" | "video";
  src: string;
};

export type CatalogGroup = {
  slug: string;
  title: string;
  imageCount: number;
  videoCount: number;
  media: CatalogMedia[];
  productHref?: string;
  productTitle?: string;
  productCover?: string;
};

export type CatalogCategory = {
  slug: string;
  title: string;
  imageCount: number;
  videoCount: number;
  cover: string;
  groups: CatalogGroup[];
};

export type CatalogProduct = {
  slug: string;
  title: string;
  categorySlug: string;
  description: string;
  features: string[];
  size: string;
  customisation: string;
  sketch: CatalogMedia[];
  renders: CatalogMedia[];
  pictures: CatalogMedia[];
};

const PU_FOAM_TOYS_CATEGORY: CatalogCategory = {
  slug: "pu-foam-toys",
  title: "PU Foam Toys",
  imageCount: 7,
  videoCount: 0,
  cover: "/factory-material/pu-foam-toys/product/pu-foam-rugby-ball-stress-toy/render/01.webp",
  groups: [
    {
      slug: "factory",
      title: "Factory",
      imageCount: 0,
      videoCount: 0,
      media: [],
    },
    {
      slug: "product",
      title: "Product",
      imageCount: 7,
      videoCount: 0,
      media: [],
      productHref: "/catalog/pu-foam-toys/pu-foam-rugby-ball-stress-toy/",
      productTitle: "PU Foam Rugby Ball Stress Toy",
      productCover:
        "/factory-material/pu-foam-toys/product/pu-foam-rugby-ball-stress-toy/render/01.webp",
    },
  ],
};

export const PU_FOAM_RUGBY_BALL: CatalogProduct = {
  slug: "pu-foam-rugby-ball-stress-toy",
  title: "PU Foam Rugby Ball Stress Toy",
  categorySlug: "pu-foam-toys",
  description:
    "A vibrant rugby-ball-shaped PU foam toy designed for promotional gifts, sports campaigns, and branded retail programmes. The textured ball-grain surface, contrasting colour panels, and raised lace detail create an authentic sporty appearance while delivering a responsive squeeze-and-release experience.",
  features: [
    "Fast rebound performance: returns to its original shape in approximately 0.5 seconds.",
    "Soft, lightweight polyurethane foam construction.",
    "Textured surface and raised lace detail for a realistic rugby-ball look.",
    "Bright custom colour combinations, logo printing, and artwork adaptation available.",
    "Suitable for sports promotions, event giveaways, team merchandise, and gift campaigns.",
    "Custom hardness, packaging, and branding options available.",
  ],
  size: "Approx. 15 × 9 × 9 cm (Length × Width × Height)",
  customisation: "Custom colours, logo placement, printed artwork, packaging, and size options are available for project-based development.",
  sketch: [
    {
      kind: "image",
      src: "/factory-material/pu-foam-toys/product/pu-foam-rugby-ball-stress-toy/sketch.webp",
    },
  ],
  renders: ["01", "02", "03"].map((number) => ({
    kind: "image" as const,
    src: `/factory-material/pu-foam-toys/product/pu-foam-rugby-ball-stress-toy/render/${number}.webp`,
  })),
  pictures: ["01", "02", "03"].map((number) => ({
    kind: "image" as const,
    src: `/factory-material/pu-foam-toys/product/pu-foam-rugby-ball-stress-toy/picture/${number}.webp`,
  })),
};

export const CATALOG_CATEGORIES = [
  PU_FOAM_TOYS_CATEGORY,
  ...(catalogData.categories as CatalogCategory[]),
];

export function getCatalogCategory(slug: string) {
  return CATALOG_CATEGORIES.find((category) => category.slug === slug);
}

export function mediaCountLabel(imageCount: number, videoCount: number) {
  const parts = [`${imageCount} ${imageCount === 1 ? "image" : "images"}`];

  if (videoCount) {
    parts.push(`${videoCount} ${videoCount === 1 ? "video" : "videos"}`);
  }

  return parts.join(" · ");
}
