import Link from "next/link";
import type { ReactNode } from "react";

import { requireAdmin } from "@/lib/auth/server";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[var(--surface-muted)]">
      <header className="border-b border-[var(--border)] bg-white">
        <div className="container-shell flex flex-wrap items-center justify-between gap-3 py-4">
          <Link className="text-xl font-semibold" href="/admin">
            Admin
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm" aria-label="Admin navigation">
            <Link className="rounded-full px-3 py-1.5 hover:bg-[var(--surface-muted)]" href="/admin/orders">
              Orders
            </Link>
            <Link className="rounded-full px-3 py-1.5 hover:bg-[var(--surface-muted)]" href="/admin/customers">
              Customers
            </Link>
            <Link className="rounded-full px-3 py-1.5 hover:bg-[var(--surface-muted)]" href="/admin/content">
              Content
            </Link>
            <Link className="rounded-full px-3 py-1.5 hover:bg-[var(--surface-muted)]" href="/admin/settings">
              Settings
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
