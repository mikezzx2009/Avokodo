import type { Metadata } from "next";
import SitePage from "@/app/SitePage";
import { PU_FOAM_RUGBY_BALL } from "@/lib/catalog";
import { DEFAULT_SITE_CONTENT } from "@/lib/content";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "PU Foam Rugby Ball Stress Toy — Avokodo",
  description:
    "Custom PU foam rugby ball stress toy with fast 0.5-second rebound performance.",
  alternates: { canonical: "/catalog/pu-foam-toys/pu-foam-rugby-ball-stress-toy/" },
};

export default function PuFoamRugbyBallStressToyPage() {
  return (
    <SitePage
      content={DEFAULT_SITE_CONTENT}
      section="catalog"
      catalogProduct={PU_FOAM_RUGBY_BALL}
    />
  );
}
