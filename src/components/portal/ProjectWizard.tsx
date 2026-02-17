"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ProjectWizard() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    propertyType: "",
    scopeSummary: "",
    addressCity: "",
    addressState: "",
  });

  const steps = [
    { id: 1, name: "Scope", status: "current" },
    { id: 2, name: "Uploads", status: "upcoming" },
    { id: 3, name: "Constraints", status: "upcoming" },
    { id: 4, name: "Submit", status: "upcoming" },
  ];

  const submit = async () => {
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Unable to create project.");
      }

      const payload = (await response.json()) as { project: { id: string } };
      router.push(`/portal/projects/${payload.project.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create project.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Card variant="outlined" className="p-10 max-w-3xl mx-auto bg-surface shadow-lg" aria-label="Project intake wizard">
      <header className="mb-10">
        <h2 className="text-display-sm font-bold tracking-tight text-text-primary">New Project Intake</h2>
        <nav aria-label="Progress" className="mt-8">
          <ol role="list" className="flex items-center gap-4">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className="flex items-center">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-[0.75rem] font-bold transition-all",
                    step.status === "current"
                      ? "bg-primary text-primary-foreground shadow-md ring-4 ring-primary/10"
                      : "bg-surface-alt text-text-secondary border border-border"
                  )}>
                    {step.id}
                  </span>
                  <span className={cn(
                    "text-[0.6875rem] font-bold uppercase tracking-widest",
                    step.status === "current" ? "text-text-primary" : "text-text-secondary"
                  )}>
                    {step.name}
                  </span>
                </div>
                {stepIdx !== steps.length - 1 && (
                  <ChevronRight className="ml-4 h-4 w-4 text-border" />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </header>

      <div className="grid gap-8">
        <div className="space-y-3">
          <Label htmlFor="project-title" className="text-body-md font-bold text-text-primary">Project Title</Label>
          <Input
            id="project-title"
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.currentTarget.value }))}
            placeholder="e.g., Luxury Kitchen Remodel"
            value={form.title}
            className="h-12"
          />
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="property-type" className="text-body-md font-bold text-text-primary">Property Type</Label>
            <Input
              id="property-type"
              onChange={(event) => setForm((prev) => ({ ...prev, propertyType: event.currentTarget.value }))}
              placeholder="e.g., Single Family Residential"
              value={form.propertyType}
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="city" className="text-body-md font-bold text-text-primary">City</Label>
            <Input
              id="city"
              onChange={(event) => setForm((prev) => ({ ...prev, addressCity: event.currentTarget.value }))}
              placeholder="Austin"
              value={form.addressCity}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="state" className="text-body-md font-bold text-text-primary">State</Label>
          <Input
            id="state"
            onChange={(event) => setForm((prev) => ({ ...prev, addressState: event.currentTarget.value }))}
            placeholder="TX"
            value={form.addressState}
            className="max-w-[120px]"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="scope" className="text-body-md font-bold text-text-primary">Scope Summary</Label>
          <Textarea
            id="scope"
            onChange={(event) => setForm((prev) => ({ ...prev, scopeSummary: event.currentTarget.value }))}
            placeholder="Describe the desired changes, style preferences, and any elements to preserve..."
            rows={5}
            value={form.scopeSummary}
            className="leading-relaxed"
          />
        </div>
      </div>

      {error ? (
        <div className="mt-6 p-4 rounded-xl bg-error/5 border border-error/20">
          <p className="text-body-sm font-bold text-error">{error}</p>
        </div>
      ) : null}

      <div className="mt-12 pt-8 border-t border-border/60">
        <Button
          className="w-full sm:w-auto min-w-[200px]"
          size="lg"
          variant="primary"
          aria-label="Create project"
          isLoading={pending}
          onClick={() => void submit()}
          type="button"
        >
          Create Project
        </Button>
      </div>
    </Card>
  );
}
