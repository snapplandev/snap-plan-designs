import Link from "next/link";

import { appHome, home, login } from "@/lib/routes";

export default function NotFoundPage() {
  return (
    <main className="global-not-found" aria-label="Page not found">
      <section className="global-not-found__panel">
        <p className="global-not-found__eyebrow">Snap Plan Designs</p>
        <h1 className="global-not-found__title">Page not found</h1>
        <p className="global-not-found__copy">
          The page you requested is not available. Continue with a known destination.
        </p>

        <nav aria-label="Recovery navigation" className="global-not-found__actions">
          <Link className="button button--primary" href={home()}>
            Home
          </Link>
          <Link className="button button--ghost" href={login()}>
            Log in
          </Link>
          <Link className="button button--ghost" href={appHome()}>
            Go to App
          </Link>
        </nav>
      </section>
    </main>
  );
}
