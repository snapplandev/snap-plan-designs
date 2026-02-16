import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
};

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:opacity-50",
        variant === "default" && "bg-[var(--primary)] text-[var(--primary-foreground)]",
        variant === "outline" && "border border-[var(--border)] bg-white",
        variant === "ghost" && "bg-transparent",
        className,
      )}
      {...props}
    />
  );
}
