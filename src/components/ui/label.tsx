import type * as React from "react";
import { cn } from "@/lib/utils";

export function Label({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("text-label font-bold uppercase tracking-[0.1em] text-[var(--color-primary)] mb-2 block", className)} {...props}>
      {children}
    </label>
  );
}
