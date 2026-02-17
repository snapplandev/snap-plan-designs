import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sideNavVariants = cva(
    "fixed left-0 top-0 z-30 flex h-full flex-col border-r border-border bg-surface transition-all duration-base ease-standard",
    {
        variants: {
            emphasis: {
                default: "w-64",
                compact: "w-20",
                expanded: "w-72",
            },
            state: {
                open: "translate-x-0",
                closed: "-translate-x-full",
            },
            theme: {
                light: "",
                dark: "dark",
            },
        },
        defaultVariants: {
            emphasis: "default",
            state: "open",
            theme: "light",
        },
    }
);

export interface SideNavProps
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sideNavVariants> {
    logo?: React.ReactNode;
    footer?: React.ReactNode;
    navItems: { label: string; href: string; icon?: React.ReactNode; active?: boolean }[];
}

export const SideNav = React.forwardRef<HTMLElement, SideNavProps>(
    ({ className, emphasis, state, theme, logo, footer, navItems, ...props }, ref) => {
        return (
            <aside
                ref={ref}
                className={cn(sideNavVariants({ emphasis, state, theme, className }))}
                {...props}
            >
                <div className="flex h-16 items-center px-6 border-b border-border">
                    {logo}
                </div>
                <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-label font-medium transition-all duration-base ease-standard hover:bg-muted focus-ring",
                                item.active ? "bg-primary/10 text-primary shadow-sm" : "text-text-secondary hover:text-text-primary",
                                emphasis === "compact" && "justify-center px-0"
                            )}
                        >
                            {item.icon && <span className="shrink-0">{item.icon}</span>}
                            {emphasis !== "compact" && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>
                {footer && (
                    <div className="border-t border-border p-4">
                        {footer}
                    </div>
                )}
            </aside>
        );
    }
);

SideNav.displayName = "SideNav";
