import Link from "next/link";

import FAQ from "@/components/marketing/FAQ";
import Hero from "@/components/marketing/Hero";
import PlanSpecimen from "@/components/marketing/PlanSpecimen";
import PricingTable from "@/components/marketing/PricingTable";
import Section from "@/components/marketing/Section";
import { appHome } from "@/lib/routes";

export default function MarketingPage() {
  return (
    <main className="mk-page">
      <header className="mk-nav" aria-label="Primary">
        <div className="mk-nav__inner">
          <Link aria-label="Snap Plan Designs home" className="mk-nav__wordmark mk-link-underline" href="/">
            Snap Plan Designs
          </Link>
          <nav className="mk-nav__actions" aria-label="Account actions">
            <Link aria-label="Log in" className="mk-cta mk-cta--secondary" href="/login">
              Log in
            </Link>
            <Link aria-label="Start a project" className="mk-cta mk-cta--primary" href={appHome()}>
              Start
            </Link>
          </nav>
        </div>
      </header>

      <div className="mk-content">
        <Hero />

        <Section className="reveal reveal--2" title="The dead zone between Pinterest and permitting.">
          <div className="mk-problem-grid">
            <article className="mk-problem reveal">
              <span className="mk-problem__marker" aria-hidden="true" />
              <h3>Estimates are guesses</h3>
            </article>
            <article className="mk-problem reveal">
              <span className="mk-problem__marker" aria-hidden="true" />
              <h3>Sketches don&apos;t translate</h3>
            </article>
            <article className="mk-problem reveal">
              <span className="mk-problem__marker" aria-hidden="true" />
              <h3>Projects stall before they start</h3>
            </article>
          </div>
        </Section>

        <Section className="reveal reveal--3" title="One decision-grade floor plan.">
          <div className="mk-artifact">
            <div className="mk-artifact__copy">
              <ul className="mk-artifact__list" aria-label="Deliverable contents">
                <li>Scaled layout plan PDF</li>
                <li>Key dimensions + flow clarity</li>
                <li>Contractor-facing notes</li>
              </ul>
            </div>
            <PlanSpecimen />
          </div>
        </Section>

        <Section className="reveal reveal--4" id="how-it-works" title="How it works">
          <ol className="mk-steps" aria-label="How it works">
            <li className="mk-step reveal">
              <span className="mk-step__index">01</span>
              <p>Submit inputs (sketch/photos/notes)</p>
            </li>
            <li className="mk-step reveal">
              <span className="mk-step__index">02</span>
              <p>We draft + validate layout clarity</p>
            </li>
            <li className="mk-step reveal">
              <span className="mk-step__index">03</span>
              <p>You receive a contractor-ready plan</p>
            </li>
          </ol>
          <p className="mk-turnaround">Typical turnaround: 48-72hr</p>
        </Section>

        <Section className="reveal reveal--4" title="Pricing">
          <PricingTable />
        </Section>

        <Section className="reveal reveal--4" title="FAQ">
          <FAQ />
        </Section>

        <section className="mk-final-cta reveal reveal--4" aria-label="Final call to action">
          <h2 className="mk-final-cta__title">Clarity first. Costly decisions second.</h2>
          <Link
            aria-label="Start a project from final call to action"
            className="mk-cta mk-cta--primary"
            href={appHome()}
          >
            Start a Project
          </Link>
          <p className="mk-final-cta__subtext">Remote. Fast. Built for real execution.</p>
        </section>
      </div>
    </main>
  );
}
