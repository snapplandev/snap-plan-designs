import * as React from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const modalVariants = cva(
    "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border border-border bg-surface p-6 shadow-2xl transition-all duration-base ease-standard sm:rounded-[var(--radius-container)] animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
    {
        variants: {
            size: {
                sm: "max-w-sm",
                md: "max-w-lg",
                lg: "max-w-2xl",
                xl: "max-w-4xl",
                full: "max-w-full h-full",
            },
            state: {
                closed: "hidden",
                open: "visible",
                loading: "opacity-80 pointer-events-none",
            },
            theme: {
                light: "",
                dark: "dark",
            },
        },
        defaultVariants: {
            size: "md",
            state: "open",
            theme: "light",
        },
    }
);

export interface ModalProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalVariants> {
    onClose: () => void;
    title?: string;
    description?: string;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
    ({ className, size, state, theme, title, description, children, onClose, ...props }, ref) => {
        return (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0">
                <div
                    ref={ref}
                    className={cn(modalVariants({ size, state, theme, className }))}
                    {...props}
                >
                    <div className="flex flex-col gap-1.5 text-center sm:text-left">
                        {title && <div className="text-body-lg font-bold text-text-primary">{title}</div>}
                        {description && <div className="text-label text-text-secondary">{description}</div>}
                    </div>
                    <div className="mt-4">{children}</div>
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 focus-ring"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </button>
                </div>
            </div>
        );
    }
);

Modal.displayName = "Modal";
