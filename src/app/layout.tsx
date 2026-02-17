import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import "@/styles/globals.css";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Snap Plan Designs",
  description: "Fast, decision-grade floor plan design for remodels and home projects.",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased font-text bg-[var(--color-bg)] text-[var(--color-text)]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
