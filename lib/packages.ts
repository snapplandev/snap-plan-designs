export type PackageId = "starter" | "standard" | "premium";

export interface PackageDefinition {
  id: PackageId;
  name: string;
  includedRevisions: number;
  turnaroundHours: number;
  bullets: string[];
}

export const PACKAGE_DEFS: Record<PackageId, PackageDefinition> = {
  starter: {
    id: "starter",
    name: "Starter",
    includedRevisions: 1,
    turnaroundHours: 72,
    bullets: ["Single concept", "Export-ready files", "Email support"],
  },
  standard: {
    id: "standard",
    name: "Standard",
    includedRevisions: 2,
    turnaroundHours: 72,
    bullets: ["Two concept directions", "Priority revision queue", "Source files included"],
  },
  premium: {
    id: "premium",
    name: "Premium",
    includedRevisions: 3,
    turnaroundHours: 48,
    bullets: ["Full design strategy", "Fastest turnaround window", "Priority support channel"],
  },
};
