import { getPublishedContent } from "@/lib/cms";
import { DEFAULT_SITE_CONTENT } from "@/lib/content";
import SitePage from "./SitePage";
import "./site.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getPublishedContent().catch(() => DEFAULT_SITE_CONTENT);

  return <SitePage content={content ?? DEFAULT_SITE_CONTENT} />;
}
