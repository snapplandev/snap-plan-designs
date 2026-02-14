import Link from "next/link";

/**
 * Editorial hero section with primary conversion actions.
 * Edge case: keeps CTAs on separate lines at narrow widths without truncating labels.
 */
export default function Hero() {
  return (
    <section className="mk-hero" aria-label="Landing page hero">
      <div className="mk-hero__stamp marketing-reveal marketing-reveal--d1">
        <span className="mk-hero__stamp-label">Folio Edition</span>
        <span className="mk-hero__stamp-rule" aria-hidden="true" />
        <span className="mk-hero__stamp-index">No. 01</span>
      </div>

      <h1 className="mk-hero__title marketing-reveal marketing-reveal--d2">
        Before you call a contractor, clarify your layout.
      </h1>

      <p className="mk-hero__subhead marketing-reveal marketing-reveal--d3">
        Snap Plan Designs turns rough ideas into scaled, contractor-ready plans&mdash;fast,
        practical, and remote.
      </p>

      <div className="mk-hero__actions marketing-reveal marketing-reveal--d4">
        <Link aria-label="Start a project with Snap Plan Designs" className="mk-cta mk-cta--primary" href="/signup">
          Start a Project
        </Link>
        <a aria-label="See how Snap Plan Designs works" className="mk-cta mk-cta--secondary" href="#how-it-works">
          See How It Works
        </a>
      </div>
    </section>
  );
}
