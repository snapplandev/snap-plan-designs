import Link from "next/link";

import { appHome } from "@/lib/routes";

/**
 * Editorial hero section with primary conversion actions.
 * Edge case: keeps CTAs on separate lines at narrow widths without truncating labels.
 */
export default function Hero() {
  return (
    <section className="mk-hero" aria-label="Landing page hero">
      <div className="mk-hero__stamp reveal reveal--1">
        <span className="mk-hero__stamp-label">Folio Edition</span>
        <span className="mk-hero__stamp-rule" aria-hidden="true" />
        <span className="mk-hero__stamp-index">No. 01</span>
      </div>

      <h1 className="mk-hero__title reveal reveal--2">
        Before you call a contractor, clarify your layout.
      </h1>

      <p className="mk-hero__subhead reveal reveal--3">
        Snap Plan Designs turns rough ideas into scaled, contractor-ready plans&mdash;fast,
        practical, and remote.
      </p>

      <div className="mk-hero__actions reveal reveal--4">
        <Link
          aria-label="Start a project with Snap Plan Designs"
          className="mk-cta mk-cta--primary"
          href={appHome()}
        >
          Start a Project
        </Link>
        <a aria-label="See how Snap Plan Designs works" className="mk-cta mk-cta--secondary" href="#how-it-works">
          See How It Works
        </a>
      </div>
    </section>
  );
}
