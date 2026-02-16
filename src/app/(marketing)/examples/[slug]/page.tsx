import { notFound } from "next/navigation";

import { exampleSlugs } from "@/lib/content/catalog";

export function generateStaticParams() {
  return exampleSlugs.map((slug) => ({ slug }));
}

export default async function ExampleSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;

  if (!exampleSlugs.includes(resolvedParams.slug)) {
    notFound();
  }

  return (
    <main className="container-shell py-14" aria-label="Example detail page">
      <h1 className="text-4xl font-semibold capitalize tracking-tight">
        {resolvedParams.slug.replaceAll("-", " ")}
      </h1>
      <p className="mt-3 max-w-2xl text-neutral-700">
        Example narrative, intake context, and final deliverable summary for this project type.
      </p>
    </main>
  );
}
