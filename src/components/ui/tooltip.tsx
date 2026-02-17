import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tooltipVariants = cva(
    "z-50 overflow-hidden rounded-[var(--radius-control)] bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    {
        variants: {
            size: {
                sm: "px-2 py-1 text-[10px]",
                md: "px-3 py-1.5 text-xs",
            },
            state: {
                visible: "opacity-100",
                hidden: "opacity-0",
            },
            theme: {
                light: "",
                dark: "dark",
            },
        },
        defaultVariants: {
            size: "md",
            state: "visible",
            theme: "light",
        },
    }
);

export interface TooltipProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tooltipVariants> {
    content: string;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
    ({ className, size, state, theme, content, children, ...props }, ref) => {
        // Note: In a real implementation, this would use a positioning engine like Floating UI or Radix.
        // For this design system, we'll provide the styled container.
        return (
            <div className="group relative inline-block">
                {children}
                <div
                    ref={ref}
                    className={cn(
                        tooltipVariants({ size, state, theme, className }),
                        "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    )}
                    {...props}
                >
                    {content}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-primary" />
                </div>
            </div>
        );
    }
);

Tooltip.displayName = "Tooltip";
