import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "Avokodo — Thoughtful digital products, made to work.";
const description =
  "Avokodo brings product thinking, interface design, and hands-on development into one focused process.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const image = `${origin}/og.png`;

  return {
    metadataBase: new URL(origin),
    title,
    description,
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Avokodo",
      title,
      description,
      images: [
        {
          url: image,
          width: 1732,
          height: 908,
          alt: "Avokodo — Thoughtful digital products, made to work.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

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
