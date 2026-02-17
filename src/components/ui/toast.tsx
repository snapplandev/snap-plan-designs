import * as React from "react";
import { X, Info, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toastVariants = cva(
    "group pointer-events-auto relative flex w-full items-start gap-4 overflow-hidden rounded-[var(--radius-container)] border border-border bg-surface p-4 shadow-lg transition-all duration-base ease-standard data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
    {
        variants: {
            emphasis: {
                info: "border-primary",
                success: "border-success",
                warning: "border-warning",
                error: "border-error",
            },
            state: {
                entering: "animate-in",
                active: "opacity-100",
                exiting: "animate-out",
                dismissed: "opacity-0",
            },
            theme: {
                light: "",
                dark: "dark",
            },
        },
        defaultVariants: {
            emphasis: "info",
            state: "active",
            theme: "light",
        },
    }
);

export interface ToastProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
    title?: string;
    description?: string;
    onClose?: () => void;
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
    ({ className, emphasis, state, theme, title, description, onClose, ...props }, ref) => {
        const icons = {
            info: <Info className="h-5 w-5 text-primary" />,
            success: <CheckCircle className="h-5 w-5 text-success" />,
            warning: <AlertTriangle className="h-5 w-5 text-warning" />,
            error: <AlertCircle className="h-5 w-5 text-error" />,
        };

        return (
            <div
                ref={ref}
                className={cn(toastVariants({ emphasis, state, theme, className }))}
                {...props}
            >
                <div className="mt-0.5">{icons[emphasis || "info"]}</div>
                <div className="grid gap-1">
                    {title && <div className="text-body-md font-semibold">{title}</div>}
                    {description && <div className="text-label text-text-secondary">{description}</div>}
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        );
    }
);

Toast.displayName = "Toast";
