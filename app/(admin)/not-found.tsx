import Link from "next/link";

import { adminHome } from "@/lib/routes";

export default function AdminNotFoundPage() {
  return (
    <section className="admin-ops" aria-label="Admin page not found">
      <h1 className="admin-ops__title">Admin page not found</h1>
      <p className="admin-ops__subtitle">The requested admin destination is unavailable.</p>
      <Link className="button button--primary" href={adminHome()}>
        Back to Admin Queue
      </Link>
    </section>
  );
}
