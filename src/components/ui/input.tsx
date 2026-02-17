import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-xl border border-border/40 bg-surface px-4 py-2 text-body-md transition-all duration-base ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:opacity-50 disabled:bg-surface-alt placeholder:text-text-secondary/50",
  {
    variants: {
      variant: {
        default: "",
        withIcon: "pl-11",
        pill: "rounded-full px-6",
      },
      size: {
        sm: "h-9 text-caption",
        md: "h-11 text-body-md",
        lg: "h-14 text-body-lg px-6",
      },
      state: {
        rest: "",
        empty: "",
        focus: "focus-visible:ring-2",
        filled: "",
        error: "border-error focus-visible:ring-error",
        disabled: "opacity-50 pointer-events-none bg-surface-alt",
        readOnly: "bg-surface-alt",
      },
      theme: {
        light: "",
        dark: "dark",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      state: "rest",
      theme: "light",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  VariantProps<typeof inputVariants> {
  leadingIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, state, theme, leadingIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leadingIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
            {leadingIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            inputVariants({
              variant: leadingIcon ? "withIcon" : variant,
              size,
              state,
              theme,
              className,
            })
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
