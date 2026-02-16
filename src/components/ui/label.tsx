import type * as React from "react";

export function Label({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className="text-sm font-medium text-neutral-700" {...props}>
      {children}
    </label>
  );
}
