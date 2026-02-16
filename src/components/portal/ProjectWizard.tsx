"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
    <section className="rounded-2xl border border-[var(--border)] bg-white p-6" aria-label="Project intake wizard">
      <h2 className="text-2xl font-semibold">Project intake</h2>
      <p className="mt-2 text-sm text-neutral-600">Step 1: scope, Step 2: uploads, Step 3: constraints, Step 4: submit.</p>
      <div className="mt-5 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="project-title">Project title</Label>
          <Input
            id="project-title"
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.currentTarget.value }))}
            placeholder="Kitchen + living room layout"
            value={form.title}
          />
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="property-type">Property type</Label>
            <Input
              id="property-type"
              onChange={(event) => setForm((prev) => ({ ...prev, propertyType: event.currentTarget.value }))}
              placeholder="Single family"
              value={form.propertyType}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              onChange={(event) => setForm((prev) => ({ ...prev, addressCity: event.currentTarget.value }))}
              placeholder="Austin"
              value={form.addressCity}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            onChange={(event) => setForm((prev) => ({ ...prev, addressState: event.currentTarget.value }))}
            placeholder="TX"
            value={form.addressState}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="scope">Scope summary</Label>
          <Textarea
            id="scope"
            onChange={(event) => setForm((prev) => ({ ...prev, scopeSummary: event.currentTarget.value }))}
            placeholder="What needs to change and what should stay?"
            rows={5}
            value={form.scopeSummary}
          />
        </div>
      </div>
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      <div className="mt-5">
        <Button aria-label="Create project" disabled={pending} onClick={() => void submit()} type="button">
          {pending ? "Creating..." : "Create project"}
        </Button>
      </div>
    </section>
  );
}
