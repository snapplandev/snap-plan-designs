type StepHeaderProps = Readonly<{
  title: string;
  guidance: string;
}>;

/**
 * Typographic heading block for each intake step.
 * Edge case: guidance wraps naturally while preserving compact vertical rhythm.
 */
export default function StepHeader({ title, guidance }: StepHeaderProps) {
  return (
    <header className="intake-step-header">
      <h1 className="intake-step-header__title">{title}</h1>
      <p className="intake-step-header__guidance">{guidance}</p>
      <span aria-hidden className="intake-step-header__rule" />
    </header>
  );
}
