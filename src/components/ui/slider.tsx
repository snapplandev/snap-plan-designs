import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sliderVariants = cva(
    "relative flex w-full touch-none select-none items-center",
    {
        variants: {
            size: {
                md: "h-5",
                lg: "h-7",
            },
            state: {
                rest: "",
                hover: "",
                active: "",
                focus: "",
                disabled: "opacity-50 pointer-events-none grayscale",
            },
            theme: {
                light: "",
                dark: "dark",
            },
        },
        defaultVariants: {
            size: "md",
            state: "rest",
            theme: "light",
        },
    }
);

export interface SliderProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "state">,
    VariantProps<typeof sliderVariants> { }

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, size, state, theme, ...props }, ref) => {
        return (
            <div className={cn(sliderVariants({ size, state, theme, className }))}>
                <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
                    <div
                        className="absolute h-full bg-primary"
                        style={{ width: `${props.value || 0}%` }}
                    />
                </div>
                <input
                    type="range"
                    ref={ref}
                    className="absolute h-full w-full opacity-0 cursor-pointer z-10"
                    {...props}
                />
                <div
                    className={cn(
                        "pointer-events-none h-5 w-5 rounded-full border-2 border-primary bg-white shadow-md transition-all duration-base ease-standard focus-ring absolute left-[calc(0%+10px)] -translate-x-1/2",
                        size === "lg" ? "h-6 w-6" : "h-5 w-5"
                    )}
                    style={{ left: `${props.value || 0}%` }}
                />
            </div>
        );
    }
);

Slider.displayName = "Slider";
