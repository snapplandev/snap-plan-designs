import Link from "next/link";

import { adminHome, adminProject, appHome } from "@/lib/routes";
import { isDemoMode } from "@/lib/runtime/mode";

type AdminShellProps = Readonly<{
  children: React.ReactNode;
}>;

/**
 * Shared admin operations layout with denser navigation and utility framing.
 * Edge case: demo mode displays an operations-safe notice while auth is intentionally bypassed.
 */
export default function AdminShell({ children }: AdminShellProps) {
  const demoMode = isDemoMode();

  return (
    <div className="admin-shell">
      <header className="admin-shell__header">
        <div className="admin-shell__header-inner">
          <div className="admin-shell__title-wrap">
            <Link aria-label="Admin queue" className="admin-shell__wordmark" href={adminHome()}>
              Admin
            </Link>
            <span aria-label="Admin interface" className="admin-shell__badge">
              Ops Desk
            </span>
          </div>

          <nav aria-label="Admin navigation" className="admin-shell__nav">
            <Link className="admin-shell__nav-link" href={adminHome()}>
              Queue
            </Link>
            <Link className="admin-shell__nav-link" href={adminProject("1")}>
              Projects
            </Link>
            <Link className="admin-shell__nav-link" href={appHome()}>
              Return to App
            </Link>
          </nav>
        </div>
      </header>

      <main className="admin-shell__main" id="main-content">
        <div className="admin-shell__container">
          {demoMode ? (
            <p className="admin-shell__demo-banner" role="status">
              Demo mode — admin queue and operations actions are running against local adapter state.
            </p>
          ) : null}
          {children}
        </div>
      </main>
    </div>
  );
}
