import type { Metadata } from "next";
import "./globals.css";

const title = "Avokodo — Product design, prototyping & manufacturing";
const description =
  "Avokodo turns physical product ideas into manufacturing-ready designs, prototypes, tooling, and production support.";
const siteUrl = "https://www.avokodotech.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    locale: "en_US",
    siteName: "Avokodo",
    title,
    description,
    images: [
      {
        url: "/og.png",
        width: 1733,
        height: 908,
        alt: "Avokodo — Product design to manufacturing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
