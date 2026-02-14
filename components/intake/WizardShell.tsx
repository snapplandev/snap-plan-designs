import Button from "@/components/ui/Button";

type WizardStep = {
  id: string;
  title: string;
};

type WizardShellProps = Readonly<{
  steps: ReadonlyArray<WizardStep>;
  currentStep: number;
  children: React.ReactNode;
  onBack: () => void;
  onNext: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  backLabel?: string;
  nextLabel?: string;
}>;

/**
 * Structural layout for intake flow with progress rail and persistent actions.
 * Edge case: rail stacks above content on narrow viewports for comfortable reading width.
 */
export default function WizardShell({
  steps,
  currentStep,
  children,
  onBack,
  onNext,
  backDisabled = false,
  nextDisabled = false,
  backLabel = "Back",
  nextLabel = "Next",
}: WizardShellProps) {
  const lastStepIndex = steps.length - 1;
  const clampedStep = Math.min(Math.max(currentStep, 0), Math.max(lastStepIndex, 0));
  const currentStepTitle = steps[clampedStep]?.title ?? "Step";

  return (
    <section aria-label="Project intake wizard" className="intake-wizard">
      <div className="intake-wizard__frame">
        <aside aria-label="Wizard progress" className="intake-wizard__rail">
          <p className="intake-wizard__kicker">Studio Intake</p>
          <ol className="intake-wizard__steps">
            {steps.map((step, index) => {
              const isCurrent = index === clampedStep;
              const isComplete = index < clampedStep;
              return (
                <li
                  aria-current={isCurrent ? "step" : undefined}
                  className="intake-wizard__step"
                  key={step.id}
                >
                  <span
                    className={[
                      "intake-wizard__step-index",
                      isCurrent ? "intake-wizard__step-index--current" : "",
                      isComplete ? "intake-wizard__step-index--complete" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={[
                      "intake-wizard__step-title",
                      isCurrent ? "intake-wizard__step-title--current" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {step.title}
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="intake-wizard__current">
            Step {clampedStep + 1} of {steps.length}: {currentStepTitle}
          </p>
        </aside>

        <div className="intake-wizard__panel">
          <div className="intake-wizard__content">{children}</div>
          <div className="intake-wizard__actions">
            <Button
              aria-label="Go back to previous step"
              disabled={backDisabled}
              onClick={onBack}
              variant="ghost"
            >
              {backLabel}
            </Button>
            <Button
              aria-label="Continue to next step"
              disabled={nextDisabled}
              onClick={onNext}
            >
              {nextLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
