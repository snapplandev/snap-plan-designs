import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { IconButton } from "./icon-button";

const paginationVariants = cva(
    "mx-auto flex w-full justify-center gap-1",
    {
        variants: {
            size: {
                md: "gap-1",
                lg: "gap-2",
            },
            state: {
                rest: "",
                loading: "opacity-50 pointer-events-none",
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

export interface PaginationProps
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof paginationVariants> {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
    ({ className, size, state, theme, currentPage, totalPages, onPageChange, ...props }, ref) => {
        return (
            <nav
                ref={ref}
                className={cn(paginationVariants({ size, state, theme, className }))}
                {...props}
            >
                <IconButton
                    variant="ghost"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || state === "loading"}
                    aria-label="Go to previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </IconButton>

                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={cn(
                                "h-9 w-9 rounded-md text-label font-medium transition-all duration-base ease-standard focus-ring hover:bg-muted",
                                currentPage === page ? "bg-primary text-primary-foreground" : "text-text-secondary"
                            )}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <IconButton
                    variant="ghost"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || state === "loading"}
                    aria-label="Go to next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </IconButton>
            </nav>
        );
    }
);

Pagination.displayName = "Pagination";
