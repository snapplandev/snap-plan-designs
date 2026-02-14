import type { ReactNode } from "react";

type SectionProps = Readonly<{
  id?: string;
  title: string;
  children: ReactNode;
  className?: string;
}>;

/**
 * Shared section scaffold for editorial content blocks.
 * Edge case: optional id enables anchor navigation without changing structure.
 */
export default function Section({ id, title, children, className }: SectionProps) {
  return (
    <section className={["mk-section", className ?? ""].filter(Boolean).join(" ")} id={id}>
      <header className="mk-section__header">
        <h2 className="mk-section__title">{title}</h2>
      </header>
      <div className="mk-section__body">{children}</div>
    </section>
  );
}
