"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/search-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { X } from "lucide-react";

// --- Types ---

export interface FilterOption {
    label: string;
    value: string;
    count?: number;
}

export interface FilterGroup {
    id: string;
    title: string;
    type: "checkbox" | "radio" | "range" | "boolean";
    options?: FilterOption[];
    min?: number;
    max?: number; // For range
}

export interface SearchFiltersProps {
    filters: FilterGroup[];
    resultsCount: number;
    className?: string;
    children: React.ReactNode; // The actual results list is passed as children
}

// --- Hook ---

function useQueryFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Create a writable copy of params
    const createQueryString = React.useCallback(
        (name: string, value: string | null) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === null) {
                params.delete(name);
            } else {
                params.set(name, value);
            }
            return params.toString();
        },
        [searchParams]
    );

    const updateFilter = (key: string, value: string | string[] | null) => {
        let newValue = value;
        if (Array.isArray(value)) {
            newValue = value.join(',');
        }
        router.push(pathname + "?" + createQueryString(key, newValue as string | null));
    };

    const getFilter = (key: string) => {
        return searchParams.get(key);
    }

    const getArrayFilter = (key: string) => {
        const val = searchParams.get(key);
        return val ? val.split(',') : [];
    }

    const clearAll = () => {
        router.push(pathname);
    }

    return { updateFilter, getFilter, getArrayFilter, clearAll, searchParams };
}

// --- Component ---

export function SearchWithFilters({ filters, resultsCount, className, children }: SearchFiltersProps) {
    const { updateFilter, getFilter, getArrayFilter, clearAll, searchParams } = useQueryFilters();
    const [isOpen, setIsOpen] = React.useState(false); // Mobile filter state

    // Debounced search handler
    const handleSearch = (term: string) => {
        // In a real app updateFilter would be debounced or the input itself
        updateFilter("q", term || null);
    };

    const activeFiltersCount = Array.from(searchParams.keys()).filter(k => k !== 'q' && k !== 'sort' && k !== 'page').length;

    return (
        <div className={cn("flex flex-col lg:flex-row gap-8", className)}>
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden flex justify-between items-center bg-surface p-4 rounded-lg border border-border">
                <span className="font-medium">{resultsCount} Results</span>
                <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
                    Filters {activeFiltersCount > 0 && <Badge className="ml-2">{activeFiltersCount}</Badge>}
                </Button>
            </div>

            {/* Sidebar Filters */}
            <aside className={cn(
                "lg:w-64 shrink-0 space-y-6 lg:block",
                isOpen ? "block" : "hidden"
            )}>
                <div className="flex items-center justify-between pb-4 border-b border-border">
                    <h3 className="text-heading-sm">Filters</h3>
                    {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs h-auto py-1 px-2">
                            Clear All
                        </Button>
                    )}
                </div>

                <Accordion type="multiple" defaultValue={filters.map(f => f.id)} className="w-full">
                    {filters.map((group) => (
                        <AccordionItem key={group.id} value={group.id}>
                            <AccordionTrigger className="text-body-md font-medium">{group.title}</AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4">
                                {group.type === "checkbox" && group.options && (
                                    <div className="space-y-3">
                                        {group.options.map((opt) => {
                                            const checked = getArrayFilter(group.id).includes(opt.value);
                                            return (
                                                <div key={opt.value} className="flex items-center justify-between group">
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            id={`${group.id}-${opt.value}`}
                                                            checked={checked}
                                                            onCheckedChange={(c) => {
                                                                const current = getArrayFilter(group.id);
                                                                const next = c
                                                                    ? [...current, opt.value]
                                                                    : current.filter(v => v !== opt.value);
                                                                updateFilter(group.id, next.length ? next : null);
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor={`${group.id}-${opt.value}`}
                                                            className="text-body-md cursor-pointer select-none"
                                                        >
                                                            {opt.label}
                                                        </label>
                                                    </div>
                                                    {opt.count !== undefined && (
                                                        <span className="text-caption text-text-muted group-hover:text-text-primary transition-colors">
                                                            {opt.count}
                                                        </span>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                {group.type === "range" && (
                                    <div className="px-2 pt-4">
                                        <Slider
                                            defaultValue={[group.min || 0, group.max || 100]}
                                            min={group.min}
                                            max={group.max}
                                            step={1}
                                            onValueCommit={(val) => updateFilter(group.id, val.join('-'))} // Simple range serialization
                                        />
                                        <div className="flex justify-between mt-2 text-caption text-text-muted">
                                            <span>${group.min}</span>
                                            <span>${group.max}+</span>
                                        </div>
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </aside>

            {/* Main Content */}
            <main className="flex-1 space-y-6">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-surface p-4 rounded-lg border border-border">
                    <div className="w-full sm:w-72">
                        <SearchField
                            placeholder="Search..."
                            defaultValue={searchParams.get('q') || ''}
                            onChange={(e) => handleSearch(e.target.value)} // Note: In real app use debounce
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <span className="text-label text-text-muted whitespace-nowrap">Sort by:</span>
                        <Select
                            value={searchParams.get('sort') || 'newest'}
                            onValueChange={(v) => updateFilter('sort', v)}
                        >
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest Arrivals</SelectItem>
                                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                                <SelectItem value="popularity">Popularity</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Active Filters Summary */}
                {activeFiltersCount > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {Array.from(searchParams.entries()).map(([key, value]) => {
                            if (['q', 'sort', 'page'].includes(key)) return null;
                            return (
                                <Badge key={key} variant="secondary" className="pl-2 pr-1 py-1 h-auto gap-1">
                                    <span className="opacity-60 capitalize">{key}:</span> {value.split(',').join(', ')}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                                        onClick={() => updateFilter(key, null)}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </Badge>
                            )
                        })}
                    </div>
                )}

                {/* Results Grid */}
                <div className="min-h-[400px]">
                    {children}
                </div>

                {/* Pagination */}
                <div className="flex justify-center border-t border-border pt-8">
                    <Pagination
                        total={Math.ceil(resultsCount / 12)}
                        current={parseInt(searchParams.get('page') || '1')}
                        onChange={(p) => updateFilter('page', p.toString())}
                    />
                </div>
            </main>
        </div>
    );
}
