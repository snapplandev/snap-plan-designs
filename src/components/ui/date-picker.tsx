import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const datePickerVariants = cva(
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

export interface DatePickerProps
    extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof datePickerVariants> {
    date?: Date;
    onDateChange?: (date: Date) => void;
    placeholder?: string;
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
    ({ className, size, state, date, onDateChange, placeholder = "Pick a date", ...props }, ref) => {
        return (
            <button
                ref={ref}
                type="button"
                className={cn(
                    datePickerVariants({
                        size,
                        state: date ? "selected" : state,
                        className,
                    })
                )}
                {...props}
            >
                <CalendarIcon className="mr-2 h-4 w-4 text-[var(--color-text-muted)]" />
                <span className="font-medium">
                    {date ? date.toLocaleDateString() : placeholder}
                </span>
            </button>
        );
    }
);

DatePicker.displayName = "DatePicker";
