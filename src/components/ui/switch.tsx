import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const switchVariants = cva(
    "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-ring disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            size: {
                md: "h-6 w-11",
                lg: "h-8 w-14",
            },
            state: {
                off: "bg-muted",
                on: "bg-primary",
                dragging: "bg-primary/80",
                focus: "ring-2 ring-primary/20",
                disabled: "opacity-50 grayscale",
            },
            theme: {
                light: "",
                dark: "dark",
            },
        },
        defaultVariants: {
            size: "md",
            state: "off",
            theme: "light",
        },
    }
);

export interface SwitchProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "state">,
    VariantProps<typeof switchVariants> { }

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
    ({ className, size, state, theme, checked, ...props }, ref) => {
        return (
            <div className="relative inline-flex items-center">
                <input
                    type="checkbox"
                    ref={ref}
                    className="peer absolute h-6 w-11 opacity-0 cursor-pointer z-10"
                    checked={checked}
                    {...props}
                />
                <div
                    className={cn(
                        switchVariants({
                            size,
                            state: checked ? "on" : state,
                            theme,
                            className,
                        })
                    )}
                >
                    <span
                        className={cn(
                            "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform duration-base ease-standard",
                            size === "lg"
                                ? "h-6 w-6 translate-x-0 data-[state=checked]:translate-x-6"
                                : "h-5 w-5 translate-x-0 data-[state=checked]:translate-x-5",
                            checked && (size === "lg" ? "translate-x-6" : "translate-x-5")
                        )}
                    />
                </div>
            </div>
        );
    }
);

Switch.displayName = "Switch";
