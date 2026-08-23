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
};

export type CatalogCategory = {
  slug: string;
  title: string;
  imageCount: number;
  videoCount: number;
  cover: string;
  groups: CatalogGroup[];
};

export const CATALOG_CATEGORIES = catalogData.categories as CatalogCategory[];

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
