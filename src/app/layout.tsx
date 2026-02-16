import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import "@/styles/globals.css";
import { buildMetadata } from "@/lib/seo/metadata";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = buildMetadata({
  title: "Snap Plan Designs",
  description: "Fast, decision-grade floor plan design for remodels and home projects.",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
