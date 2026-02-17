import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800" aria-label="Site footer">
      <div className="container mx-auto px-4 md:px-6 py-16 grid gap-12 md:grid-cols-4 lg:grid-cols-5">
        <section className="md:col-span-2">
          <Link href="/" className="inline-block mb-4">
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Snap Plan Designs</span>
          </Link>
          <p className="max-w-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
            Exclusive weekly slots. Proven layouts. Instant clarity before you spend.
          </p>
        </section>

        <nav className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">Solutions</h3>
          <ul className="flex flex-col gap-3">
            <li><Link className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" href="/how-it-works">How It Works</Link></li>
            <li><Link className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" href="/pricing">Pricing</Link></li>
            <li><Link className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" href="/examples">Examples</Link></li>
            <li><Link className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" href="/start-project">Start Project</Link></li>
          </ul>
        </nav>

        <nav className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">Company</h3>
          <ul className="flex flex-col gap-3">
            <li><Link className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" href="/about">About</Link></li>
            <li><Link className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" href="/basement-hub">Basement Hub</Link></li>
            <li><Link className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" href="/resources">Resources</Link></li>
            <li><Link className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" href="/faq">FAQ</Link></li>
            <li><Link className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" href="/contact">Contact</Link></li>
          </ul>
        </nav>

        <nav className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">Legal</h3>
          <ul className="flex flex-col gap-3">
            <li><Link className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" href="/legal/guarantee">Guarantee</Link></li>
            <li><Link className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" href="/legal/terms">Terms</Link></li>
            <li><Link className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" href="/legal/privacy">Privacy</Link></li>
            <li><Link className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" href="/legal/refund-policy">Refund Policy</Link></li>
          </ul>
        </nav>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          © {new Date().getFullYear()} Snap Plan Designs. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors" href="#">Instagram</Link>
          <Link className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors" href="#">Pinterest</Link>
          <Link className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors" href="#">YouTube</Link>
        </div>
      </div>
    </footer>
  );
}
