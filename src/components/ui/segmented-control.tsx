import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const segmentedControlVariants = cva(
    "inline-flex p-1 bg-surface-alt rounded-xl border border-border shadow-sm w-fit",
    {
        variants: {
            count: {
                2: "grid-cols-2",
                3: "grid-cols-3",
                4: "grid-cols-4",
                5: "grid-cols-5",
            },
            state: {
                rest: "",
                disabled: "opacity-50 pointer-events-none",
            },
        },
        defaultVariants: {
            count: 2,
            state: "rest",
        },
    }
);

export interface SegmentedControlProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof segmentedControlVariants> {
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
}

export const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
    ({ className, count, state, options, value, onChange, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("grid", segmentedControlVariants({ count, state, className }))}
                {...props}
            >
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "px-4 py-1.5 text-label font-medium rounded-lg transition-all duration-base ease-standard flex items-center justify-center min-h-[36px]",
                            value === option.value
                                ? "bg-surface text-text-primary shadow-sm"
                                : "text-text-secondary hover:text-text-primary hover:bg-black/5"
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        );
    }
);

SegmentedControl.displayName = "SegmentedControl";
