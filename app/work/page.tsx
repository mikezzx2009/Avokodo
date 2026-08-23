import { SectionRoute, sectionMetadata } from "../SectionRoute";

export const dynamic = "force-static";
export const metadata = sectionMetadata("work");

export default function WorkPage() {
  return <SectionRoute section="work" />;
}
