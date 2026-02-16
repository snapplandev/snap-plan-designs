import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/90 backdrop-blur" aria-label="Site header">
      <div className="container-shell flex items-center justify-between py-4">
        <Link className="text-xl font-semibold tracking-tight" href="/" aria-label="Snap Plan Designs home">
          Snap Plan Designs
        </Link>
        <nav className="flex items-center gap-2" aria-label="Primary navigation">
          <Link className="rounded-full px-3 py-2 text-sm" href="/pricing">
            Pricing
          </Link>
          <Link className="rounded-full px-3 py-2 text-sm" href="/how-it-works">
            How It Works
          </Link>
          <Link href="/login">
            <Button variant="outline" aria-label="Log in">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button aria-label="Get started">Get started</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
