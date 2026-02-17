import * as React from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
    "inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-base ease-standard",
    {
        variants: {
            emphasis: {
                filled: "bg-primary text-primary-foreground hover:bg-primary/90",
                outline: "bg-transparent text-foreground border border-border hover:bg-muted",
                tonal: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            },
            size: {
                sm: "h-7 px-2.5 text-xs",
                md: "h-9 px-4 text-label",
                lg: "h-11 px-6 text-body-md",
            },
            state: {
                rest: "",
                hover: "scale-[1.02]",
                active: "scale-[0.98]",
                selected: "ring-2 ring-primary ring-offset-2",
                disabled: "opacity-50 pointer-events-none grayscale",
            },
            theme: {
                light: "",
                dark: "dark",
            },
        },
        defaultVariants: {
            emphasis: "tonal",
            size: "md",
            state: "rest",
            theme: "light",
        },
    }
);

export interface ChipProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
    onRemove?: () => void;
    leadingIcon?: React.ReactNode;
}

export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
    ({ className, emphasis, size, state, theme, children, onRemove, leadingIcon, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(chipVariants({ emphasis, size, state, theme, className }))}
                {...props}
            >
                {leadingIcon && <span className="shrink-0">{leadingIcon}</span>}
                <span className="truncate">{children}</span>
                {onRemove && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        className="shrink-0 p-0.5 rounded-full hover:bg-black/10 transition-colors"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>
        );
    }
);

Chip.displayName = "Chip";
