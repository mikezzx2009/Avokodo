import { SectionRoute, sectionMetadata } from "../SectionRoute";

export const dynamic = "force-static";
export const metadata = sectionMetadata("services");

export default function ServicesPage() {
  return <SectionRoute section="services" />;
}
