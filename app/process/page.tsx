import { SectionRoute, sectionMetadata } from "../SectionRoute";

export const dynamic = "force-static";
export const metadata = sectionMetadata("process");

export default function ProcessPage() {
  return <SectionRoute section="process" />;
}
