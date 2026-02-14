import Link from "next/link";

import { hasSupabasePublicEnv } from "@/lib/supabase/env-public";

type AppShellProps = Readonly<{
  children: React.ReactNode;
}>;

/**
 * Shared authenticated layout wrapper with a refined header and footer.
 * Edge case: header navigation wraps on narrow widths without truncating links.
 */
export default function AppShell({ children }: AppShellProps) {
  const isDemoMode = !hasSupabasePublicEnv();

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <div className="app-shell__header-inner">
          <Link
            aria-label="Snap Plan Designs home"
            className="app-shell__wordmark"
            href="/app"
          >
            Snap Plan Designs
          </Link>
          <nav aria-label="Primary navigation" className="app-shell__nav">
            <Link className="app-shell__nav-link" href="/app">
              Projects
            </Link>
            <Link className="app-shell__nav-link" href="/login">
              Account
            </Link>
          </nav>
        </div>
      </header>

      <main className="app-shell__main" id="main-content">
        <div className="app-shell__container">
          {isDemoMode ? (
            <p className="app-shell__demo-banner" role="status">
              Demo mode — authentication and storage will activate once Supabase is configured.
            </p>
          ) : null}
          {children}
        </div>
      </main>

      <footer className="app-shell__footer">
        <div className="app-shell__container app-shell__footer-inner">
          <p className="app-shell__footer-copy">
            &copy; {new Date().getFullYear()} Snap Plan Designs
          </p>
        </div>
      </footer>
    </div>
  );
}
