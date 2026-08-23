import { SectionRoute, sectionMetadata } from "../SectionRoute";

export const dynamic = "force-static";
export const metadata = sectionMetadata("contact");

export default function ContactPage() {
  return <SectionRoute section="contact" />;
}
