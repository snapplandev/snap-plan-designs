import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all duration-base ease-standard focus-ring disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] min-h-[44px] min-w-[44px]",
    {
        variants: {
            variant: {
                primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
                secondary: "bg-surface-alt text-text-primary border border-border hover:bg-border/30",
                ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-alt",
                outline: "bg-transparent text-primary border border-border hover:bg-primary/5",
            },
            size: {
                sm: "h-9 w-9 p-2",
                md: "h-11 w-11 p-3",
                lg: "h-14 w-14 p-4",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export interface IconButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> { }

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(iconButtonVariants({ variant, size, className }))}
                {...props}
            />
        );
    }
);

IconButton.displayName = "IconButton";
