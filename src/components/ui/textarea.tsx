import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "flex min-h-[120px] w-full rounded-xl border border-[var(--color-border)]/40 bg-[var(--color-surface)] px-4 py-3 text-body-md transition-all duration-base ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus-visible:border-[var(--color-primary)] disabled:opacity-50 disabled:bg-[var(--color-surface-alt)]/20 placeholder:text-[var(--color-text-muted)]/50",
  {
    variants: {
      size: {
        md: "text-body-md",
        lg: "text-body-lg px-6 py-4",
      },
      state: {
        empty: "",
        error: "border-[var(--color-error)] focus-visible:ring-[var(--color-error)]/20 focus-visible:border-[var(--color-error)]",
      },
    },
    defaultVariants: {
      size: "md",
      state: "empty",
    },
  }
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
  VariantProps<typeof textareaVariants> { }

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, state, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(textareaVariants({ size, state, className }))}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
