import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SitePage from "@/app/SitePage";
import {
  CATALOG_CATEGORIES,
  getCatalogCategory,
  mediaCountLabel,
} from "@/lib/catalog";
import { DEFAULT_SITE_CONTENT } from "@/lib/content";

export const dynamic = "force-static";
export const dynamicParams = false;

type CatalogCategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CATALOG_CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CatalogCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCatalogCategory(slug);

  if (!category) return {};

  const title = `${category.title} Catalog — Avokodo`;
  const description = `${mediaCountLabel(
    category.imageCount,
    category.videoCount,
  )} from the Avokodo ${category.title} product and factory material library.`;
  const url = `/catalog/${category.slug}/`;
  const imageUrl = `https://www.avokodotech.com${category.cover}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      locale: "en_US",
      siteName: "Avokodo",
      title,
      description,
      images: [{ url: imageUrl, alt: `${category.title} catalog cover` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function CatalogCategoryPage({
  params,
}: CatalogCategoryPageProps) {
  const { slug } = await params;
  const category = getCatalogCategory(slug);

  if (!category) notFound();

  return (
    <SitePage
      content={DEFAULT_SITE_CONTENT}
      section="catalog"
      catalogCategory={category}
    />
  );
}
