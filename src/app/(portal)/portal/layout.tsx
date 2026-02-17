import Link from "next/link";
import type { ReactNode } from "react";

import { requireUser } from "@/lib/auth/server";

export default async function PortalLayout({ children }: { children: ReactNode }) {
  await requireUser();

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="border-b border-[var(--color-border)]/30 bg-[var(--color-surface)] shadow-sm">
        <div className="container-shell flex flex-wrap items-center justify-between gap-4 py-5">
          <Link className="text-heading-md font-bold tracking-tight text-[var(--color-primary)]" href="/portal">
            Client Portal
          </Link>
          <nav className="flex flex-wrap items-center gap-1 text-sm" aria-label="Portal navigation">
            <Link className="rounded-pill px-4 py-2 font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-primary)] transition-all" href="/portal/projects">
              Projects
            </Link>
            <Link className="rounded-pill px-4 py-2 font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-primary)] transition-all" href="/portal/projects/new">
              New Project
            </Link>
            <Link className="rounded-pill px-4 py-2 font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-primary)] transition-all" href="/portal/billing">
              Billing
            </Link>
            <Link className="rounded-pill px-4 py-2 font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-primary)] transition-all" href="/portal/account">
              Account
            </Link>
            <Link className="rounded-pill px-4 py-2 font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-primary)] transition-all" href="/portal/support">
              Support
            </Link>
          </nav>
        </div>
      </header>
      <main className="container-shell py-12">
        {children}
      </main>
    </div>
  );
}
