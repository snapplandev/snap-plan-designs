import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const popoverVariants = cva(
    "z-50 w-72 rounded-[var(--radius-container)] border border-border bg-surface p-4 text-foreground shadow-lg outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    {
        variants: {
            size: {
                sm: "w-60 p-3",
                md: "w-72 p-4",
                lg: "w-96 p-6",
            },
            state: {
                rest: "",
                open: "visible",
                disabled: "opacity-50 pointer-events-none grayscale",
            },
            theme: {
                light: "",
                dark: "dark",
            },
        },
        defaultVariants: {
            size: "md",
            state: "rest",
            theme: "light",
        },
    }
);

export interface PopoverProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof popoverVariants> {
    trigger: React.ReactNode;
}

export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
    ({ className, size, state, theme, trigger, children, ...props }, ref) => {
        const [isOpen, setIsOpen] = React.useState(false);

        return (
            <div className="relative inline-block">
                <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
                {isOpen && (
                    <div
                        ref={ref}
                        className={cn(popoverVariants({ size, state, theme, className }), "absolute top-full left-1/2 -translate-x-1/2 mt-2")}
                        {...props}
                    >
                        {children}
                    </div>
                )}
            </div>
        );
    }
);

Popover.displayName = "Popover";
