import Link from "next/link";

import { GalleryGrid } from "@/components/marketing/GalleryGrid";
import { exampleSlugs } from "@/lib/content/catalog";

export default function ExamplesPage() {
  return (
    <main className="py-14" aria-label="Examples page">
      <section className="container-shell">
        <h1 className="text-4xl font-semibold tracking-tight">Examples</h1>
        <p className="mt-3 text-neutral-700">Real project patterns and deliverable structure.</p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          {exampleSlugs.map((slug) => (
            <Link className="rounded-full border border-[var(--border)] px-3 py-1.5" href={`/examples/${slug}`} key={slug}>
              {slug.replaceAll("-", " ")}
            </Link>
          ))}
        </div>
      </section>
      <GalleryGrid />
    </main>
  );
}
