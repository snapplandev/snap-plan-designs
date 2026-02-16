import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center p-6" aria-label="Not found">
      <section className="max-w-xl rounded-2xl border border-[var(--border)] bg-white p-8 text-center">
        <h1 className="text-4xl font-semibold">Page not found</h1>
        <p className="mt-3 text-neutral-700">The resource you requested does not exist.</p>
        <div className="mt-6">
          <Link href="/">
            <Button aria-label="Back home">Back home</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
