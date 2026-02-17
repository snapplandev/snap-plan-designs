import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tabsVariants = cva(
    "inline-flex h-11 items-center justify-center rounded-xl bg-surface-alt p-1 text-text-secondary transition-all duration-base ease-standard",
    {
        variants: {
            variant: {
                segmented: "bg-surface-alt",
                underline: "bg-transparent border-b border-border rounded-none h-auto p-0 gap-6",
            },
            size: {
                md: "h-11",
                lg: "h-14",
            },
        },
        defaultVariants: {
            variant: "segmented",
            size: "md",
        },
    }
);

const tabItemVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-1.5 text-label font-medium ring-offset-background transition-all duration-base ease-standard focus-ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                segmented: "data-[state=active]:bg-surface data-[state=active]:text-text-primary data-[state=active]:shadow-sm",
                underline: "rounded-none border-b-2 border-transparent px-1 pb-3 data-[state=active]:border-primary data-[state=active]:text-text-primary",
            },
        },
        defaultVariants: {
            variant: "segmented",
        },
    }
);

export interface TabsProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof tabsVariants> {
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    ({ className, variant = "segmented", size, options, value, onChange, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(tabsVariants({ variant, size, className }))}
                {...props}
            >
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        data-state={value === option.value ? "active" : "inactive"}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            tabItemVariants({
                                variant: variant === "underline" ? "underline" : "segmented"
                            })
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        );
    }
);

Tabs.displayName = "Tabs";
