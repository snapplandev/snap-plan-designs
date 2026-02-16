import Link from "next/link";
import type { ReactNode } from "react";

import { requireUser } from "@/lib/auth/server";

export default async function PortalLayout({ children }: { children: ReactNode }) {
  await requireUser();

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--border)] bg-white">
        <div className="container-shell flex flex-wrap items-center justify-between gap-3 py-4">
          <Link className="text-xl font-semibold" href="/portal">
            Client Portal
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm" aria-label="Portal navigation">
            <Link className="rounded-full px-3 py-1.5 hover:bg-[var(--surface-muted)]" href="/portal/projects">
              Projects
            </Link>
            <Link className="rounded-full px-3 py-1.5 hover:bg-[var(--surface-muted)]" href="/portal/projects/new">
              New Project
            </Link>
            <Link className="rounded-full px-3 py-1.5 hover:bg-[var(--surface-muted)]" href="/portal/billing">
              Billing
            </Link>
            <Link className="rounded-full px-3 py-1.5 hover:bg-[var(--surface-muted)]" href="/portal/account">
              Account
            </Link>
            <Link className="rounded-full px-3 py-1.5 hover:bg-[var(--surface-muted)]" href="/portal/support">
              Support
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
