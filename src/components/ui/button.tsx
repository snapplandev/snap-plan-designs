import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-base ease-standard focus-ring disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] min-h-[44px]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        secondary: "bg-transparent text-text-muted border border-border hover:text-text hover:bg-surface-2",
        tertiary: "bg-transparent text-text hover:bg-surface-2 border border-border",
        ghost: "bg-transparent text-text-muted hover:text-text hover:bg-surface-2",
      },
      size: {
        sm: "px-5 py-2 text-caption tracking-wide",
        md: "px-6 py-3 text-body-md",
        lg: "px-10 py-4 text-body-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leadingIcon,
      trailingIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({
            variant,
            size,
            className,
          })
        )}
        disabled={props.disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leadingIcon && <span className="flex shrink-0">{leadingIcon}</span>
        )}
        {children}
        {!isLoading && trailingIcon && <span className="flex shrink-0">{trailingIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
