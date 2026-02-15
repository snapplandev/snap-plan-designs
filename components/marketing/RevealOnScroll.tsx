"use client";

import { useEffect } from "react";

/**
 * Observes marketing reveal nodes and toggles in-view animation state.
 * Edge case: falls back to immediate visibility when reduced motion is requested.
 */
export default function RevealOnScroll() {
  useEffect(() => {
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!revealNodes.length) {
      return;
    }

    revealNodes.forEach((node) => node.setAttribute("data-reveal", "true"));

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealNodes.forEach((node) => node.classList.add("is-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    revealNodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);

  return null;
}
