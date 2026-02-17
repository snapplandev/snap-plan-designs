"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const accordionVariants = cva(
    "w-full border-b border-border",
    {
        variants: {
            state: {
                collapsed: "",
                expanded: "",
                disabled: "opacity-50 pointer-events-none grayscale",
            },
            theme: {
                light: "",
                dark: "dark",
            },
        },
        defaultVariants: {
            state: "collapsed",
            theme: "light",
        },
    }
);

export interface AccordionProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionVariants> {
    title: string;
    isOpen?: boolean;
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
    ({ className, state, theme, title, children, isOpen: initialOpen = false, ...props }, ref) => {
        const [isOpen, setIsOpen] = React.useState(initialOpen);

        return (
            <div
                ref={ref}
                className={cn(accordionVariants({ state: isOpen ? "expanded" : state, theme, className }))}
                {...props}
            >
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-full items-center justify-between py-4 font-medium transition-all hover:text-primary"
                >
                    {title}
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 shrink-0 text-text-secondary transition-transform duration-base ease-standard",
                            isOpen && "rotate-180"
                        )}
                    />
                </button>
                <div
                    className={cn(
                        "overflow-hidden text-body-md transition-all duration-base ease-standard",
                        isOpen ? "max-h-[1000px] pb-4 opacity-100" : "max-h-0 opacity-0"
                    )}
                >
                    {children}
                </div>
            </div>
        );
    }
);

Accordion.displayName = "Accordion";
