import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
    "rounded-3xl transition-all duration-base ease-standard",
    {
        variants: {
            variant: {
                outlined: "bg-surface border border-border/60",
                elevated: "bg-surface shadow-md hover:shadow-xl border border-border/10",
                interactive: "bg-surface border border-border/40 hover:border-primary hover:shadow-lg cursor-pointer active:scale-[0.99]",
            },
        },
        defaultVariants: {
            variant: "outlined",
        },
    }
);

export interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> { }

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(cardVariants({ variant, className }))}
                {...props}
            />
        );
    }
);

Card.displayName = "Card";
