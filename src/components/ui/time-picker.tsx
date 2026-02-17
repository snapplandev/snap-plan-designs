import * as React from "react";
import { Clock } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const timePickerVariants = cva(
    "w-full flex items-center justify-start text-left font-normal border border-[var(--color-border)]/40 bg-[var(--color-surface)] rounded-xl transition-all duration-base ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus-visible:border-[var(--color-primary)] disabled:opacity-50 disabled:bg-[var(--color-surface-alt)]/20",
    {
        variants: {
            size: {
                md: "h-11 px-4 text-body-md",
                lg: "h-14 px-6 text-body-lg",
            },
            state: {
                idle: "text-[var(--color-text-muted)]",
                selected: "text-[var(--color-primary)]",
                disabled: "opacity-50 pointer-events-none grayscale",
            },
        },
        defaultVariants: {
            size: "md",
            state: "idle",
        },
    }
);

export interface TimePickerProps
    extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof timePickerVariants> {
    time?: string;
    onTimeChange?: (time: string) => void;
    placeholder?: string;
}

export const TimePicker = React.forwardRef<HTMLButtonElement, TimePickerProps>(
    ({ className, size, state, time, onTimeChange, placeholder = "Set time", ...props }, ref) => {
        return (
            <button
                ref={ref}
                type="button"
                className={cn(
                    timePickerVariants({
                        size,
                        state: time ? "selected" : state,
                        className,
                    })
                )}
                {...props}
            >
                <Clock className="mr-2 h-4 w-4 text-[var(--color-text-muted)]" />
                <span className="font-medium">
                    {time ? time : placeholder}
                </span>
            </button>
        );
    }
);

TimePicker.displayName = "TimePicker";
