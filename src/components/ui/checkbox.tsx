import * as React from "react";
import { Check, Minus } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const checkboxVariants = cva(
    "peer h-5 w-5 shrink-0 rounded-md border border-primary ring-offset-background transition-all duration-base ease-standard focus-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
    {
        variants: {
            state: {
                unchecked: "bg-transparent border-border hover:border-primary",
                checked: "bg-primary border-primary",
                indeterminate: "bg-primary border-primary",
                error: "border-error focus-visible:ring-error",
            },
        },
        defaultVariants: {
            state: "unchecked",
        },
    }
);

export interface CheckboxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "state" | "checked">,
    VariantProps<typeof checkboxVariants> {
    checked?: boolean | "indeterminate";
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, state, checked, ...props }, ref) => {
        return (
            <div className="relative flex items-center justify-center h-5 w-5">
                <input
                    type="checkbox"
                    ref={ref}
                    className={cn(
                        "peer absolute h-5 w-5 opacity-0 cursor-pointer z-10",
                        props.disabled && "cursor-not-allowed"
                    )}
                    checked={checked === true || checked === "indeterminate"}
                    {...props}
                />
                <div
                    className={cn(
                        checkboxVariants({
                            state: checked === "indeterminate" ? "indeterminate" : checked ? "checked" : state,
                            className,
                        }),
                        "flex items-center justify-center transition-colors"
                    )}
                >
                    {checked === true && <Check className="h-3.5 w-3.5 text-primary-foreground stroke-[3]" />}
                    {checked === "indeterminate" && <Minus className="h-3.5 w-3.5 text-primary-foreground stroke-[3]" />}
                </div>
            </div>
        );
    }
);

Checkbox.displayName = "Checkbox";
