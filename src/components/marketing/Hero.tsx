import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="container-shell grid gap-8 py-16 md:grid-cols-2" aria-label="Hero section">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.18em] text-neutral-600">MVP launch</p>
        <h1 className="text-5xl font-semibold leading-tight tracking-tight">From rough ideas to contractor-ready plans.</h1>
        <p className="max-w-xl text-neutral-700">
          Snap Plan Designs converts sketches, photos, and notes into practical floor plan deliverables with fast
          turnaround.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/pricing">
            <Button aria-label="View pricing">View pricing</Button>
          </Link>
          <Link href="/examples">
            <Button aria-label="See examples" variant="outline">
              See examples
            </Button>
          </Link>
        </div>
      </div>
      <div className="card-surface rounded-3xl p-8">
        <p className="text-sm text-neutral-600">Typical timeline</p>
        <p className="mt-2 text-3xl font-semibold">48-72 hours</p>
        <ul className="mt-4 space-y-2 text-sm text-neutral-700">
          <li>1. Submit intake wizard</li>
          <li>2. Upload references and dimensions</li>
          <li>3. Receive plan PDF and notes</li>
        </ul>
      </div>
    </section>
  );
}
