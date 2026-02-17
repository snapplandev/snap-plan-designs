import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const bottomSheetVariants = cva(
    "fixed inset-x-0 bottom-0 z-50 flex h-auto flex-col rounded-t-[var(--radius-container)] border border-border bg-surface p-6 shadow-2xl transition-all duration-base ease-standard animate-in slide-in-from-bottom-full",
    {
        variants: {
            state: {
                collapsed: "h-20",
                expanded: "h-[80vh]",
                loading: "opacity-80 pointer-events-none",
                disabled: "opacity-50 pointer-events-none grayscale",
            },
            theme: {
                light: "",
                dark: "dark",
            },
        },
        defaultVariants: {
            state: "expanded",
            theme: "light",
        },
    }
);

export interface BottomSheetProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bottomSheetVariants> {
    onClose: () => void;
}

export const BottomSheet = React.forwardRef<HTMLDivElement, BottomSheetProps>(
    ({ className, state, theme, children, onClose, ...props }, ref) => {
        return (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0" onClick={onClose}>
                <div
                    ref={ref}
                    className={cn(bottomSheetVariants({ state, theme, className }))}
                    onClick={(e) => e.stopPropagation()}
                    {...props}
                >
                    <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-muted" />
                    <div className="overflow-auto">{children}</div>
                </div>
            </div>
        );
    }
);

BottomSheet.displayName = "BottomSheet";
