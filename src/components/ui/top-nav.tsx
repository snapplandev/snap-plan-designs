import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const topNavVariants = cva(
    "sticky top-0 z-40 w-full border-b border-border bg-surface/80 backdrop-blur-md",
    {
        variants: {
            emphasis: {
                default: "h-16",
                compact: "h-12",
                large: "h-20",
            },
            state: {
                rest: "",
                scrolled: "shadow-sm",
            },
            theme: {
                light: "",
                dark: "dark",
            },
        },
        defaultVariants: {
            emphasis: "default",
            state: "rest",
            theme: "light",
        },
    }
);

export interface TopNavProps
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof topNavVariants> {
    logo?: React.ReactNode;
    actions?: React.ReactNode;
    navItems: { label: string; href: string; active?: boolean }[];
}

export const TopNav = React.forwardRef<HTMLElement, TopNavProps>(
    ({ className, emphasis, state, theme, logo, actions, navItems, ...props }, ref) => {
        return (
            <header
                ref={ref}
                className={cn(topNavVariants({ emphasis, state, theme, className }))}
                {...props}
            >
                <div className="container mx-auto flex h-full items-center justify-between px-6">
                    <div className="flex items-center gap-8">
                        {logo && <div className="shrink-0">{logo}</div>}
                        <nav className="hidden md:flex items-center gap-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "text-label font-medium transition-colors hover:text-primary",
                                        item.active ? "text-primary" : "text-text-secondary"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    {actions && <div className="flex items-center gap-4">{actions}</div>}
                </div>
            </header>
        );
    }
);

TopNav.displayName = "TopNav";
