import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const dataTableVariants = cva(
    "w-full border-collapse text-left text-body-md",
    {
        variants: {
            emphasis: {
                default: "",
                striped: "[&_tbody_tr:nth-child(even)]:bg-surface-alt",
                bordered: "border border-border [&_th]:border-b [&_td]:border-b",
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
            emphasis: "default",
            state: "rest",
            theme: "light",
        },
    }
);

export interface DataTableProps
    extends React.TableHTMLAttributes<HTMLTableElement>,
    VariantProps<typeof dataTableVariants> {
    headers: React.ReactNode[];
    rows: React.ReactNode[][];
}

export const DataTable = React.forwardRef<HTMLTableElement, DataTableProps>(
    ({ className, emphasis, state, theme, headers, rows, ...props }, ref) => {
        return (
            <div className="w-full overflow-auto rounded-[var(--radius-container)] border border-border bg-surface">
                <table
                    ref={ref}
                    className={cn(dataTableVariants({ emphasis, state, theme, className }))}
                    {...props}
                >
                    <thead>
                        <tr className="border-b border-border bg-surface-alt/50">
                            {headers.map((header, i) => (
                                <th key={i} className="px-6 py-4 font-semibold text-text-primary">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i} className="border-b border-border last:border-0 hover:bg-black/5 transition-colors">
                                {row.map((cell, j) => (
                                    <td key={j} className="px-6 py-4 text-text-secondary">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
);

DataTable.displayName = "DataTable";
