import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function CancelPage() {
  return (
    <main className="grid min-h-screen place-items-center p-6" aria-label="Checkout cancel page">
      <section className="max-w-xl rounded-2xl border border-[var(--border)] bg-white p-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Checkout canceled</h1>
        <p className="mt-3 text-neutral-700">No charge was made. You can return to pricing any time.</p>
        <div className="mt-6">
          <Link href="/pricing">
            <Button aria-label="Back to pricing">Back to pricing</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
