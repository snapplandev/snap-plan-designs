import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper"; // Assuming a Stepper UI component exists or adapting generic one
import { AlertBanner } from "@/components/ui/alert-banner";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---

export interface Step<T = any> {
    id: string;
    label: string;
    description?: string;
    component: React.ComponentType<{
        data: T;
        onChange: (data: Partial<T>) => void;
        errors: Record<string, string>;
    }>;
    validate?: (data: T) => Record<string, string> | Promise<Record<string, string>>;
}

export interface MultiStepFormProps<T = any> {
    steps: Step<T>[];
    initialData: T;
    onComplete: (data: T) => Promise<void>;
    className?: string;
}

type FormStatus = "idle" | "validating" | "submitting" | "error" | "success";

// --- Logic Hook ---

function useMultiStepForm<T>(
    steps: Step<T>[],
    initialData: T,
    onComplete: (data: T) => Promise<void>
) {
    const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
    const [data, setData] = React.useState<T>(initialData);
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [status, setStatus] = React.useState<FormStatus>("idle");
    const [globalError, setGlobalError] = React.useState<string | null>(null);

    const currentStep = steps[currentStepIndex];
    const isLastStep = currentStepIndex === steps.length - 1;
    const isFirstStep = currentStepIndex === 0;

    const updateData = React.useCallback((updates: Partial<T>) => {
        setData((prev) => ({ ...prev, ...updates }));
        // Clear errors for fields being updated
        if (Object.keys(updates).length > 0) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                Object.keys(updates).forEach((key) => delete newErrors[key]);
                return newErrors;
            });
        }
    }, []);

    const validateStep = async () => {
        setStatus("validating");
        setGlobalError(null);
        try {
            if (currentStep.validate) {
                const stepErrors = await currentStep.validate(data);
                if (Object.keys(stepErrors).length > 0) {
                    setErrors(stepErrors);
                    setStatus("idle");
                    return false;
                }
            }
            return true;
        } catch (err) {
            console.error("Validation error:", err);
            setGlobalError("An unexpected error occurred during validation.");
            setStatus("idle");
            return false;
        }
    };

    const next = async () => {
        const isValid = await validateStep();
        if (!isValid) return;

        if (isLastStep) {
            await submit();
        } else {
            setStatus("idle");
            setCurrentStepIndex((prev) => prev + 1);
        }
    };

    const back = () => {
        if (isFirstStep) return;
        setGlobalError(null);
        setCurrentStepIndex((prev) => prev - 1);
    };

    const submit = async () => {
        setStatus("submitting");
        try {
            await onComplete(data);
            setStatus("success");
        } catch (err) {
            console.error("Submission error:", err);
            setGlobalError(err instanceof Error ? err.message : "Failed to submit form.");
            setStatus("error");
        }
    };

    return {
        currentStepIndex,
        currentStep,
        data,
        updateData,
        errors,
        status,
        globalError,
        isFirstStep,
        isLastStep,
        next,
        back,
        steps,
    };
}

// --- Component ---

export function MultiStepForm<T>({
    steps,
    initialData,
    onComplete,
    className,
}: MultiStepFormProps<T>) {
    const form = useMultiStepForm(steps, initialData, onComplete);
    const CurrentStepComponent = form.currentStep.component;

    if (form.status === "success") {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <h3 className="text-heading-md mb-2">Success!</h3>
                <p className="text-body-md text-text-muted">
                    Your submission has been received.
                </p>
            </div>
        );
    }

    return (
        <div className={cn("space-y-8 max-w-2xl mx-auto", className)}>
            {/* Progress Indicator - Adapting generic layout since standard Stepper might be input control */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col gap-1">
                    <span className="text-label text-text-muted">Step {form.currentStepIndex + 1} of {steps.length}</span>
                    <h2 className="text-heading-md">{form.currentStep.label}</h2>
                </div>

                {/* Simple Progress Bar */}
                <div className="hidden sm:flex items-center gap-2">
                    {steps.map((_, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "h-2 w-8 rounded-full transition-colors duration-300",
                                idx <= form.currentStepIndex ? "bg-primary" : "bg-border"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Global Error Banner */}
            {form.globalError && (
                <AlertBanner variant="error" title="Error">
                    {form.globalError}
                </AlertBanner>
            )}

            {/* Step Content */}
            <div className="relative min-h-[300px] bg-surface p-6 md:p-8 rounded-[var(--radius-container)] border border-border shadow-sm">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={form.currentStepIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <CurrentStepComponent
                            data={form.data}
                            onChange={form.updateData}
                            errors={form.errors}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center pt-4">
                <Button
                    variant="outline"
                    onClick={form.back}
                    disabled={form.isFirstStep || form.status === "submitting"}
                    className={cn(form.isFirstStep && "invisible")}
                >
                    Back
                </Button>

                <Button
                    onClick={form.next}
                    disabled={form.status === "submitting" || form.status === "validating"}
                    className="min-w-[100px]"
                >
                    {form.status === "submitting" || form.status === "validating" ? (
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Processing...
                        </span>
                    ) : form.isLastStep ? (
                        "Complete"
                    ) : (
                        "Next"
                    )}
                </Button>
            </div>
        </div>
    );
}
