"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";

// --- Configuration Types ---

export interface PricingConfig {
    users: number;
    storageGB: number;
    annual: boolean;
    addons: {
        analytics: boolean;
        support: boolean;
        security: boolean;
    };
}

const DEFAULTS: PricingConfig = {
    users: 10,
    storageGB: 50,
    annual: true,
    addons: {
        analytics: false,
        support: false,
        security: false,
    },
};

// --- Pricing Engine Hook ---

function usePricingEngine(config: PricingConfig) {
    return React.useMemo(() => {
        // Base Rates
        const USER_RATE = 15; // per user/mo
        const STORAGE_RATE = 0.5; // per GB/mo

        // Addon Rates
        const ADDON_RATES = {
            analytics: 49,
            support: 99,
            security: 199,
        };

        // Calculations
        const usersCost = config.users * USER_RATE;
        const storageCost = config.storageGB * STORAGE_RATE;

        let addonsCost = 0;
        if (config.addons.analytics) addonsCost += ADDON_RATES.analytics;
        if (config.addons.support) addonsCost += ADDON_RATES.support;
        if (config.addons.security) addonsCost += ADDON_RATES.security;

        let subtotal = usersCost + storageCost + addonsCost;

        // Discounts
        const volumeDiscount = config.users > 50 ? 0.15 : config.users > 20 ? 0.05 : 0;
        const annualDiscount = config.annual ? 0.20 : 0;

        const discountAmount = subtotal * (volumeDiscount + annualDiscount);
        const total = subtotal - discountAmount;

        return {
            monthly: config.annual ? total : total,
            total: config.annual ? total * 12 : total,
            breakdown: [
                { label: "Users", value: usersCost, detail: `${config.users} users @ $${USER_RATE}` },
                { label: "Storage", value: storageCost, detail: `${config.storageGB}GB @ $${STORAGE_RATE}/GB` },
                { label: "Add-ons", value: addonsCost, detail: Object.entries(config.addons).filter(([, v]) => v).length + " selected" },
            ],
            discounts: [
                volumeDiscount > 0 && { label: "Volume Discount", value: -1 * (subtotal * volumeDiscount), percent: volumeDiscount * 100 },
                annualDiscount > 0 && { label: "Annual Billing", value: -1 * (subtotal * annualDiscount), percent: annualDiscount * 100 },
            ].filter(Boolean) as { label: string; value: number; percent: number }[]
        };
    }, [config]);
}

// --- Component ---

export function PricingCalculator() {
    const [config, setConfig] = React.useState<PricingConfig>(DEFAULTS);
    const price = usePricingEngine(config);

    const handleAddonToggle = (key: keyof PricingConfig['addons']) => {
        setConfig(prev => ({
            ...prev,
            addons: { ...prev.addons, [key]: !prev.addons[key] }
        }));
    };

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto p-4">
            {/* Configuration Panel */}
            <Card className="lg:col-span-7 p-6 md:p-8 space-y-8 bg-surface border-border/50 shadow-sm">
                <div>
                    <h2 className="text-heading-md mb-2">Configure Your Plan</h2>
                    <p className="text-body-md text-text-muted">Adjust usage to estimate your monthly costs.</p>
                </div>

                {/* Sliders Section */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-label font-medium">Team Size</label>
                            <span className="text-body-md font-mono bg-surface-alt px-2 py-1 rounded-md">{config.users} users</span>
                        </div>
                        <Slider
                            value={[config.users]}
                            min={1}
                            max={100}
                            step={1}
                            onValueChange={([val]) => setConfig({ ...config, users: val })}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-label font-medium">Storage</label>
                            <span className="text-body-md font-mono bg-surface-alt px-2 py-1 rounded-md">{config.storageGB} GB</span>
                        </div>
                        <Slider
                            value={[config.storageGB]}
                            min={10}
                            max={1000}
                            step={10}
                            onValueChange={([val]) => setConfig({ ...config, storageGB: val })}
                        />
                    </div>
                </div>

                <div className="h-px bg-border my-6" />

                {/* Add-ons Section */}
                <div className="space-y-4">
                    <label className="text-label font-medium mb-4 block">Premium Add-ons</label>

                    {[
                        { id: 'analytics', label: 'Advanced Analytics', price: '$49/mo', desc: 'Custom reports & dashboards' },
                        { id: 'support', label: '24/7 Priority Support', price: '$99/mo', desc: 'Dedicated success manager' },
                        { id: 'security', label: 'Enterprise Security', price: '$199/mo', desc: 'SSO, Audit Logs, & Compliance' },
                    ].map((addon) => (
                        <div
                            key={addon.id}
                            onClick={() => handleAddonToggle(addon.id as any)}
                            className={cn(
                                "flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:bg-surface-alt/50",
                                config.addons[addon.id as keyof typeof config.addons]
                                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                    : "border-border"
                            )}
                        >
                            <div className={cn(
                                "flex items-center justify-center w-5 h-5 mt-0.5 rounded border transition-colors",
                                config.addons[addon.id as keyof typeof config.addons]
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "border-text-muted"
                            )}>
                                {config.addons[addon.id as keyof typeof config.addons] && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <span className="font-medium text-body-md">{addon.label}</span>
                                    <span className="text-body-md font-medium">{addon.price}</span>
                                </div>
                                <p className="text-caption text-text-muted">{addon.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Summary Panel */}
            <div className="lg:col-span-5 space-y-6">
                <Card className="p-6 md:p-8 bg-surface-alt/30 border-border shadow-lg sticky top-6">
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-heading-sm font-semibold">Estimated Cost</span>
                        <div className="flex items-center gap-3">
                            <span className={cn("text-label cursor-pointer", !config.annual && "font-semibold")}>Monthly</span>
                            <Switch
                                checked={config.annual}
                                onCheckedChange={(val) => setConfig({ ...config, annual: val })}
                            />
                            <span className={cn("text-label cursor-pointer", config.annual && "font-semibold text-primary")}>
                                Yearly <Badge variant="secondary" className="ml-1 text-[10px] py-0 h-4">SAVE 20%</Badge>
                            </span>
                        </div>
                    </div>

                    <div className="mb-8 text-center">
                        <div className="text-display-lg font-bold text-text-primary tracking-tight">
                            {formatCurrency(price.monthly)}
                        </div>
                        <div className="text-body-md text-text-muted mt-1">
                            per month, billed {config.annual ? 'annually' : 'monthly'}
                        </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-border">
                        {price.breakdown.map((item, i) => (
                            <div key={i} className="flex justify-between text-body-md">
                                <span className="text-text-muted flex items-center gap-1">
                                    {item.label}
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger><Info className="w-3.5 h-3.5 text-text-muted/50" /></TooltipTrigger>
                                            <TooltipContent><p>{item.detail}</p></TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </span>
                                <span>{formatCurrency(item.value)}</span>
                            </div>
                        ))}

                        {price.discounts.map((item, i) => (
                            <div key={i} className="flex justify-between text-body-md text-success">
                                <span>{item.label} ({item.percent.toFixed(0)}%)</span>
                                <span>{formatCurrency(item.value)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 mt-6 border-t border-border flex justify-between items-center">
                        <span className="text-heading-sm font-bold">Total</span>
                        <span className="text-heading-md font-bold text-primary">
                            {formatCurrency(price.total)}
                            <span className="text-body-md font-normal text-text-muted block text-right text-xs">
                                / {config.annual ? 'year' : 'mo'}
                            </span>
                        </span>
                    </div>

                    <Button className="w-full mt-8" size="lg">
                        Start Free Trial
                    </Button>
                    <p className="text-center text-caption text-text-muted mt-4">
                        No credit card required. 14-day free trial on all plans.
                    </p>
                </Card>
            </div>
        </div>
    );
}
