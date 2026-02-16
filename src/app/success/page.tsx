import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <main className="grid min-h-screen place-items-center p-6" aria-label="Checkout success page">
      <section className="max-w-xl rounded-2xl border border-[var(--border)] bg-white p-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Payment successful</h1>
        <p className="mt-3 text-neutral-700">Your order is confirmed. Continue in the portal to complete your project intake.</p>
        <div className="mt-6">
          <Link href="/portal/projects/new">
            <Button aria-label="Go to portal">Go to portal</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
