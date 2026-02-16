import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { serviceSlugs } from "@/lib/content/catalog";
import { buildMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  return buildMetadata({
    title: `${resolvedParams.slug.replaceAll("-", " ")} | Snap Plan Designs`,
    description: "Service details and package expectations.",
    path: `/services/${resolvedParams.slug}`,
  });
}

export default async function ServiceSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;

  if (!serviceSlugs.includes(resolvedParams.slug)) {
    notFound();
  }

  return (
    <main className="container-shell py-14" aria-label="Service details">
      <h1 className="text-4xl font-semibold capitalize tracking-tight">
        {resolvedParams.slug.replaceAll("-", " ")}
      </h1>
      <p className="mt-4 max-w-2xl text-neutral-700">
        This service includes scoped intake, collaborative messaging, and versioned PDF deliverables through the portal.
      </p>
    </main>
  );
}
