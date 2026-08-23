import { SectionRoute, sectionMetadata } from "../SectionRoute";

export const dynamic = "force-static";
export const metadata = sectionMetadata("about");

export default function AboutPage() {
  return <SectionRoute section="about" />;
}
