import Link from "next/link";
import type { CSSProperties } from "react";

import { appHome } from "@/lib/routes";

const REVEAL_DELAY_80 = { "--reveal-delay": "80ms" } as CSSProperties;
const REVEAL_DELAY_160 = { "--reveal-delay": "160ms" } as CSSProperties;
const REVEAL_DELAY_240 = { "--reveal-delay": "240ms" } as CSSProperties;
const REVEAL_DELAY_320 = { "--reveal-delay": "320ms" } as CSSProperties;
const REVEAL_DELAY_400 = { "--reveal-delay": "400ms" } as CSSProperties;

/**
 * Marketing footer with newsletter-style signup shell and grouped site links.
 * Edge case: button and checkbox are non-submitting UI shells only (no backend action).
 */
export default function Footer() {
  return (
    <footer className="mk-footer" aria-label="Site footer">
      <div className="mk-footer__inner">
        <section className="mk-footer__top">
          <div className="mk-footer__brand reveal" style={REVEAL_DELAY_80}>
            <p className="mk-footer__wordmark">Snap Plan Designs</p>
            <p className="mk-footer__descriptor">
              Layout clarity for real renovation decisions. Fast, remote, and contractor-ready.
            </p>

            <div className="mk-footer__signup" role="group" aria-label="Newsletter signup">
              <label className="mk-footer__label" htmlFor="footer-email">
                Work email
              </label>
              <div className="mk-footer__signup-row">
                <input
                  aria-label="Email address"
                  className="mk-footer__input"
                  id="footer-email"
                  name="email"
                  placeholder="you@company.com"
                  type="email"
                />
                <button className="mk-cta mk-cta--primary btn-anim" type="button">
                  <span className="btn-text-group">
                    <span className="btn-text-track">
                      <span className="btn-text">Subscribe</span>
                      <span aria-hidden="true" className="btn-text">
                        Subscribe
                      </span>
                    </span>
                  </span>
                  <span aria-hidden="true" className="btn-arrow-wrap">
                    <span className="btn-arrow-bg" />
                    <span className="btn-arrow-group">
                      <span className="btn-arrow">→</span>
                      <span className="btn-arrow">→</span>
                    </span>
                  </span>
                </button>
              </div>
              <label className="mk-footer__consent">
                <input className="mk-footer__checkbox" type="checkbox" />
                <span>Receive occasional updates and design notes.</span>
              </label>
            </div>
          </div>

          <div className="mk-footer__links">
            <nav className="mk-footer__col reveal" style={REVEAL_DELAY_160} aria-label="Explore">
              <p className="mk-footer__heading">Explore</p>
              <Link href="/">Home</Link>
              <a href="#how-it-works">How it works</a>
              <a href="#pricing">Pricing</a>
            </nav>

            <nav className="mk-footer__col reveal" style={REVEAL_DELAY_240} aria-label="Services">
              <p className="mk-footer__heading">Services</p>
              <Link href={appHome()}>Start a project</Link>
              <Link href={appHome()}>Project workspace</Link>
              <a href="#faq">FAQ</a>
            </nav>

            <nav className="mk-footer__col reveal" style={REVEAL_DELAY_320} aria-label="Company">
              <p className="mk-footer__heading">Company</p>
              <Link href="/login">Log in</Link>
              <Link href="/signup">Create account</Link>
              <Link href="/admin">Admin</Link>
            </nav>

            <nav className="mk-footer__col reveal" style={REVEAL_DELAY_400} aria-label="Legal">
              <p className="mk-footer__heading">Legal</p>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Accessibility</a>
            </nav>
          </div>
        </section>
      </div>

      <div className="mk-footer__legal-wrap reveal" style={REVEAL_DELAY_400}>
        <div className="mk-footer__legal-glow" aria-hidden="true" />
        <p className="mk-footer__legal">
          &copy; {new Date().getFullYear()} Snap Plan Designs. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
