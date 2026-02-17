import * as React from "react";
import { Info, AlertTriangle, CheckCircle, AlertCircle, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertBannerVariants = cva(
    "relative w-full flex items-start gap-3 p-4 rounded-[var(--radius-control)] border transition-all duration-base ease-standard",
    {
        variants: {
            emphasis: {
                info: "bg-primary/5 border-primary/20",
                success: "bg-success/5 border-success/20",
                warning: "bg-warning/5 border-warning/20",
                error: "bg-error/5 border-error/20",
            },
            state: {
                visible: "opacity-100",
                dismissed: "opacity-0 scale-95 pointer-events-none",
            },
            theme: {
                light: "",
                dark: "dark",
            },
        },
        defaultVariants: {
            emphasis: "info",
            state: "visible",
            theme: "light",
        },
    }
);

export interface AlertBannerProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertBannerVariants> {
    onClose?: () => void;
    title: string;
}

export const AlertBanner = React.forwardRef<HTMLDivElement, AlertBannerProps>(
    ({ className, emphasis, state, theme, title, children, onClose, ...props }, ref) => {
        const icons = {
            info: <Info className="h-5 w-5 text-primary" />,
            success: <CheckCircle className="h-5 w-5 text-success" />,
            warning: <AlertTriangle className="h-5 w-5 text-warning" />,
            error: <AlertCircle className="h-5 w-5 text-error" />,
        };

        return (
            <div
                ref={ref}
                className={cn(alertBannerVariants({ emphasis, state, theme, className }))}
                {...props}
            >
                <div className="mt-0.5">{icons[emphasis || "info"]}</div>
                <div className="flex-1 grid gap-1">
                    <div className="text-body-md font-semibold text-text-primary">{title}</div>
                    {children && <div className="text-label text-text-secondary">{children}</div>}
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-black/5 text-text-secondary transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        );
    }
);

AlertBanner.displayName = "AlertBanner";
