import { SectionRoute, sectionMetadata } from "../SectionRoute";

export const dynamic = "force-static";
export const metadata = sectionMetadata("catalog");

export default function CatalogPage() {
  return <SectionRoute section="catalog" />;
}
