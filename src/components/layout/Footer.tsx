import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[var(--surface)]" aria-label="Site footer">
      <div className="container-shell grid gap-6 py-10 md:grid-cols-3">
        <section>
          <h2 className="text-base font-semibold">Snap Plan Designs</h2>
          <p className="mt-2 text-sm text-neutral-600">Decision-grade layout planning for homeowners and contractors.</p>
        </section>
        <nav className="grid gap-2 text-sm" aria-label="Footer links">
          <Link href="/services">Services</Link>
          <Link href="/examples">Examples</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <nav className="grid gap-2 text-sm" aria-label="Legal links">
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/disclaimer">Disclaimer</Link>
        </nav>
      </div>
    </footer>
  );
}
