import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const radioVariants = cva(
    "peer h-5 w-5 shrink-0 rounded-full border border-primary ring-offset-background transition-all duration-base ease-standard focus-ring disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            state: {
                unchecked: "bg-transparent",
                checked: "bg-primary border-primary",
                focus: "ring-2 ring-primary/20",
                disabled: "opacity-50 grayscale",
                error: "border-error",
            },
            theme: {
                light: "",
                dark: "dark",
            },
        },
        defaultVariants: {
            state: "unchecked",
            theme: "light",
        },
    }
);

export interface RadioProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "state">,
    VariantProps<typeof radioVariants> { }

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
    ({ className, state, theme, checked, ...props }, ref) => {
        return (
            <div className="relative flex items-center justify-center h-5 w-5">
                <input
                    type="radio"
                    ref={ref}
                    className={cn(
                        "peer absolute h-5 w-5 opacity-0 cursor-pointer z-10",
                        props.disabled && "cursor-not-allowed"
                    )}
                    checked={checked}
                    {...props}
                />
                <div
                    className={cn(
                        radioVariants({
                            state: checked ? "checked" : state,
                            theme,
                            className,
                        }),
                        "flex items-center justify-center transition-colors"
                    )}
                >
                    {checked && (
                        <div className="h-2 w-2 rounded-full bg-primary-foreground transition-all duration-base ease-standard" />
                    )}
                </div>
            </div>
        );
    }
);

Radio.displayName = "Radio";
