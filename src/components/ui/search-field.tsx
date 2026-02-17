import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface SearchFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
    onClear?: () => void;
}

export const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
    ({ className, value, onChange, onClear, ...props }, ref) => {
        const hasValue = value !== undefined && value !== null && value !== "";

        const { ...rest } = props;

        return (
            <div className={cn("relative group w-full", className)}>
                <Input
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    leadingIcon={<Search className="h-4 w-4 transition-colors group-hover:text-primary" />}
                    className="pr-10"
                    {...rest}
                />
                {hasValue && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            onClear?.();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-all duration-base"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        );
    }
);

SearchField.displayName = "SearchField";
