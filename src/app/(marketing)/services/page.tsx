import Link from "next/link";

import { serviceSlugs } from "@/lib/content/catalog";

export default function ServicesPage() {
  return (
    <main className="container-shell py-14" aria-label="Services page">
      <h1 className="text-4xl font-semibold tracking-tight">Services</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {serviceSlugs.map((slug) => (
          <article className="card-surface rounded-2xl p-5" key={slug}>
            <h2 className="text-xl font-semibold capitalize">{slug.replaceAll("-", " ")}</h2>
            <p className="mt-2 text-sm text-neutral-700">Design package details, process, and expected deliverables.</p>
            <Link className="mt-4 inline-block text-sm font-medium underline" href={`/services/${slug}`}>
              View details
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
