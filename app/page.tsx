import { DEFAULT_SITE_CONTENT } from "@/lib/content";
import SitePage from "./SitePage";
import "./site.css";

export const dynamic = "force-static";

export default function Home() {
  return <SitePage content={DEFAULT_SITE_CONTENT} />;
}
