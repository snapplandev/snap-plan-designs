"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import {
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    Plus,
    Settings,
    User,
    CreditCard
} from "lucide-react";

// --- Types ---

export interface Metric {
    label: string;
    value: string;
    trend?: number; // percentage
    trendLabel?: string;
    status?: "neutral" | "positive" | "negative";
}

export interface ActivityItem {
    id: string;
    user: {
        name: string;
        avatar?: string;
    };
    action: string;
    target: string;
    timestamp: string;
    status: "completed" | "pending" | "failed";
}

// --- Components ---

const MetricCard = ({ metric }: { metric: Metric }) => (
    <Card className="p-6 flex flex-col justify-between h-full bg-surface border-border shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <span className="text-label text-text-muted font-medium">{metric.label}</span>
            {metric.status && (
                <Badge
                    className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        metric.status === "positive" && "bg-success/10 text-success hover:bg-success/20",
                        metric.status === "negative" && "bg-error/10 text-error hover:bg-error/20",
                        metric.status === "neutral" && "bg-surface-alt text-text-muted"
                    )}
                >
                    {metric.trend && (metric.trend > 0 ? "+" : "")}{metric.trend}%
                </Badge>
            )}
        </div>

        <div>
            <h3 className="text-heading-lg font-bold tracking-tight">{metric.value}</h3>
            {metric.trendLabel && (
                <div className="flex items-center gap-1 mt-1 text-caption text-text-muted">
                    {metric.status === "positive" ? <ArrowUpRight className="w-3 h-3 text-success" /> : <ArrowDownRight className="w-3 h-3 text-error" />}
                    <span>{metric.trendLabel}</span>
                </div>
            )}
        </div>
    </Card>
);

const QuickActions = () => (
    <Card className="p-6 space-y-4 bg-surface-alt/30 border-dashed border-border">
        <h4 className="text-body-md font-semibold text-text-muted uppercase tracking-wider text-xs">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-20 flex-col gap-2 hover:border-primary hover:text-primary transition-colors">
                <Plus className="w-6 h-6" />
                New Project
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:border-primary hover:text-primary transition-colors">
                <User className="w-6 h-6" />
                Invite Team
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:border-primary hover:text-primary transition-colors">
                <CreditCard className="w-6 h-6" />
                Billing
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:border-primary hover:text-primary transition-colors">
                <Settings className="w-6 h-6" />
                Settings
            </Button>
        </div>
    </Card>
);

// --- Main Dashboard ---

export function UserDashboard() {
    // Mock Data - In real app fetch this
    const metrics: Metric[] = [
        { label: "Total Revenue", value: "$45,231.89", trend: 20.1, trendLabel: "vs last month", status: "positive" },
        { label: "Active Subscriptions", value: "+2350", trend: 180.1, trendLabel: "vs last month", status: "positive" },
        { label: "Sales", value: "+12,234", trend: 19, trendLabel: "vs last month", status: "positive" },
        { label: "Active Now", value: "+573", trend: 201, trendLabel: "since last hour", status: "neutral" },
    ];

    const recentActivity: ActivityItem[] = [
        { id: "1", user: { name: "Jackson Lee" }, action: "created new project", target: "Marketing Campaign Q4", timestamp: "2 mins ago", status: "completed" },
        { id: "2", user: { name: "Isabella Nguyen" }, action: "commented on", target: "Homepage Redesign", timestamp: "15 mins ago", status: "pending" },
        { id: "3", user: { name: "Will Kim" }, action: "deployed", target: "Production Server", timestamp: "1 hour ago", status: "completed" },
        { id: "4", user: { name: "Sofia Davis" }, action: "updated", target: "Billing Settings", timestamp: "3 hours ago", status: "failed" },
        { id: "5", user: { name: "Jackson Lee" }, action: "archived", target: "Old Assets", timestamp: "5 hours ago", status: "completed" },
    ];

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-heading-lg font-bold">Dashboard</h1>
                    <p className="text-body-md text-text-muted">Overview of your account activity and performance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-caption text-text-muted bg-surface px-3 py-1 rounded-full border border-border">
                        Last updated: Just now
                    </span>
                    <Button>Download Report</Button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric, i) => (
                    <MetricCard key={i} metric={metric} />
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Recent Activity Table */}
                <Card className="lg:col-span-2 p-0 overflow-hidden border-border bg-surface">
                    <div className="p-6 border-b border-border flex justify-between items-center">
                        <h3 className="text-heading-sm font-semibold">Recent Activity</h3>
                        <Button variant="ghost" size="sm">View All</Button>
                    </div>
                    <DataTable
                        headers={["User", "Action", "Target", "Status", ""]}
                        rows={recentActivity.map(item => [
                            <span className="font-medium text-text-primary">{item.user.name}</span>,
                            <span className="text-text-muted">{item.action}</span>,
                            <span className="font-medium">{item.target}</span>,
                            <Badge variant="outline" className={cn(
                                "capitalize border-0",
                                item.status === "completed" && "bg-success/10 text-success",
                                item.status === "failed" && "bg-error/10 text-error",
                                item.status === "pending" && "bg-warning/10 text-warning"
                            )}>{item.status}</Badge>,
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
                        ])}
                    />
                </Card>

                {/* Sidebar Area */}
                <div className="space-y-8">
                    <QuickActions />

                    <Card className="p-6 bg-accent/5 border-accent/20">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-accent">Pro Tip</h3>
                            <p className="text-body-sm text-text-muted">
                                You can customize your dashboard layout by dragging and dropping widgets.
                            </p>
                            <Button variant="link" className="px-0 text-accent">Learn more &rarr;</Button>
                        </div>
                    </Card>
                </div>
            </div>

        </div>
    );
}
