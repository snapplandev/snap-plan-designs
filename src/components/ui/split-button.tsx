import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const splitButtonVariants = cva(
    "inline-flex items-center rounded-pill shadow-md overflow-hidden",
    {
        variants: {
            emphasis: {
                primary: "bg-[var(--color-primary)] text-[var(--color-surface)]",
                secondary: "bg-[var(--color-secondary)] text-[var(--color-surface)]",
            },
            size: {
                md: "h-11",
                lg: "h-14",
            },
        },
        defaultVariants: {
            emphasis: "primary",
            size: "md",
        },
    }
);

export interface SplitButtonProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof splitButtonVariants> {
    onMainClick?: () => void;
    onDropdownClick?: () => void;
    children: React.ReactNode;
}

export const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>(
    ({ className, emphasis, size, children, onMainClick, onDropdownClick, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(splitButtonVariants({ emphasis, size, className }))}
                {...props}
            >
                <button
                    onClick={onMainClick}
                    className={cn(
                        "flex-1 px-6 h-full flex items-center justify-center font-semibold border-r border-white/10 hover:bg-white/5 transition-colors",
                        size === "lg" ? "px-8 text-body-lg" : "text-body-md"
                    )}
                >
                    {children}
                </button>
                <button
                    onClick={onDropdownClick}
                    className="px-4 h-full flex items-center justify-center hover:bg-white/5 transition-colors"
                >
                    <ChevronDown className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
                </button>
            </div>
        );
    }
);

SplitButton.displayName = "SplitButton";
