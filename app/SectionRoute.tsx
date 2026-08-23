import type { Metadata } from "next";
import { DEFAULT_SITE_CONTENT } from "@/lib/content";
import SitePage, { type SectionSlug } from "./SitePage";

const SECTION_DETAILS: Record<
  SectionSlug,
  { title: string; description: string }
> = {
  catalog: {
    title: "Catalog",
    description:
      "Explore Avokodo product-development examples alongside their factory and production context.",
  },
  about: {
    title: "About",
    description: DEFAULT_SITE_CONTENT.about.paragraphs[0],
  },
  services: {
    title: "Services",
    description: DEFAULT_SITE_CONTENT.services.intro,
  },
  work: {
    title: "Work",
    description: DEFAULT_SITE_CONTENT.work.intro,
  },
  process: {
    title: "Process",
    description: DEFAULT_SITE_CONTENT.process.intro,
  },
  contact: {
    title: "Contact",
    description: DEFAULT_SITE_CONTENT.contact.description,
  },
};

export function sectionMetadata(section: SectionSlug): Metadata {
  const details = SECTION_DETAILS[section];
  const title = `${details.title} — Avokodo`;
  const url = `/${section}/`;
  const image = {
    url: "/og.png",
    width: 1733,
    height: 908,
    alt: "Avokodo — Product design to manufacturing",
  };

  return {
    title,
    description: details.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      locale: "en_US",
      siteName: "Avokodo",
      title,
      description: details.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: details.description,
      images: [image.url],
    },
  };
}

export function SectionRoute({ section }: { section: SectionSlug }) {
  return <SitePage content={DEFAULT_SITE_CONTENT} section={section} />;
}
