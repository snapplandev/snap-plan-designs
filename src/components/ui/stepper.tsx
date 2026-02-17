import * as React from "react";
import { Plus, Minus } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { IconButton } from "./icon-button";

const stepperVariants = cva(
    "inline-flex items-center gap-1 p-1 bg-surface-alt rounded-[var(--radius-control)] border border-border",
    {
        variants: {
            size: {
                md: "h-11",
                lg: "h-14",
            },
            state: {
                idle: "",
                increment: "",
                decrement: "",
                disabled: "opacity-50 pointer-events-none grayscale",
            },
            theme: {
                light: "",
                dark: "dark",
            },
        },
        defaultVariants: {
            size: "md",
            state: "idle",
            theme: "light",
        },
    }
);

export interface StepperProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "size" | "onChange">,
    VariantProps<typeof stepperVariants> {
    value: number;
    min?: number;
    max?: number;
    onChange: (value: number) => void;
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
    ({ className, size, state, theme, value, min = 0, max = 100, onChange, ...props }, ref) => {
        const handleDecrement = () => {
            if (value > min) onChange(value - 1);
        };

        const handleIncrement = () => {
            if (value < max) onChange(value + 1);
        };

        return (
            <div
                ref={ref}
                className={cn(stepperVariants({ size, state, theme, className }))}
                {...props}
            >
                <IconButton
                    variant="ghost"
                    size="sm"
                    onClick={handleDecrement}
                    disabled={value <= min || state === "disabled"}
                    aria-label="Decrement"
                >
                    <Minus className="h-4 w-4" />
                </IconButton>
                <span className={cn(
                    "min-w-[40px] text-center font-medium tabular-nums",
                    size === "lg" ? "text-body-lg" : "text-body-md"
                )}>
                    {value}
                </span>
                <IconButton
                    variant="ghost"
                    size="sm"
                    onClick={handleIncrement}
                    disabled={value >= max || state === "disabled"}
                    aria-label="Increment"
                >
                    <Plus className="h-4 w-4" />
                </IconButton>
            </div>
        );
    }
);

Stepper.displayName = "Stepper";
