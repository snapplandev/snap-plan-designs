import { notFound } from "next/navigation";

import { blogSlugs } from "@/lib/content/catalog";

export function generateStaticParams() {
  return blogSlugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;

  if (!blogSlugs.includes(resolvedParams.slug)) {
    notFound();
  }

  return (
    <main className="container-shell py-14" aria-label="Blog post page">
      <h1 className="text-4xl font-semibold capitalize tracking-tight">
        {resolvedParams.slug.replaceAll("-", " ")}
      </h1>
      <article className="prose mt-6 max-w-none">
        <p>
          Placeholder post for MVP. Replace with MDX content under <code>src/content</code> in later phases.
        </p>
      </article>
    </main>
  );
}
