import Link from "next/link";

import { blogSlugs } from "@/lib/content/catalog";

export default function BlogPage() {
  return (
    <main className="container-shell py-14" aria-label="Blog page">
      <h1 className="text-4xl font-semibold tracking-tight">Blog</h1>
      <ul className="mt-6 space-y-3">
        {blogSlugs.map((slug) => (
          <li className="rounded-xl border border-[var(--border)] bg-white p-4" key={slug}>
            <Link className="text-lg font-medium underline-offset-2 hover:underline" href={`/blog/${slug}`}>
              {slug.replaceAll("-", " ")}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
