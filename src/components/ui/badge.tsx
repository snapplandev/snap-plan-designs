import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-pill font-bold uppercase tracking-[0.1em] transition-all duration-base ease-standard",
    {
        variants: {
            variant: {
                primary: "bg-primary text-primary-foreground",
                secondary: "bg-surface-alt text-text-primary border border-border/60",
                success: "bg-success/5 text-success border border-success/20",
                warning: "bg-warning/5 text-warning border border-warning/20",
                error: "bg-error/5 text-error border border-error/20",
                info: "bg-primary/5 text-primary border border-primary/20",
                neutral: "bg-surface-alt text-text-secondary border border-border/40",
                outline: "bg-transparent text-primary border border-border",
            },
            size: {
                xs: "h-5 px-2 text-[0.625rem]",
                sm: "h-6 px-2.5 text-[0.6875rem]",
                md: "h-7 px-3.5 text-[0.75rem]",
            },
        },
        defaultVariants: {
            variant: "neutral",
            size: "md",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(badgeVariants({ variant, size, className }))}
                {...props}
            />
        );
    }
);

Badge.displayName = "Badge";
