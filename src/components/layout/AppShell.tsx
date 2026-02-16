import type { ReactNode } from "react";

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <main className="container-shell py-8" aria-label={title}>
        <h1 className="mb-6 text-3xl font-semibold tracking-tight">{title}</h1>
        {children}
      </main>
    </div>
  );
}
