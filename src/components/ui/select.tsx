import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const selectVariants = cva(
    "flex h-11 w-full items-center justify-between rounded-[var(--radius-control)] border border-input bg-surface px-4 py-2 text-body-md transition-all duration-base ease-standard focus-ring disabled:opacity-50 disabled:bg-surface-alt appearance-none",
    {
        variants: {
            size: {
                md: "h-11 text-body-md",
                lg: "h-14 text-body-lg px-6",
            },
            state: {
                closed: "",
                open: "border-primary ring-2 ring-primary/20",
                selected: "",
                error: "border-error text-error",
                disabled: "opacity-50 pointer-events-none bg-surface-alt",
            },
            theme: {
                light: "",
                dark: "dark",
            },
        },
        defaultVariants: {
            size: "md",
            state: "closed",
            theme: "light",
        },
    }
);

export interface SelectProps
    extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectVariants> {
    options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, size, state, theme, options, ...props }, ref) => {
        return (
            <div className="relative w-full">
                <select
                    ref={ref}
                    className={cn(selectVariants({ size, state, theme, className }))}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                    <ChevronDown className="h-4 w-4" />
                </div>
            </div>
        );
    }
);

Select.displayName = "Select";
