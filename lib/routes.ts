import { checkoutUrl } from "@/lib/billing/url";
import type { PackageId } from "@/lib/packages";

export function appHome(): string {
  return "/app";
}

export function newProject(): string {
  return "/app/projects/new";
}

export function project(id: string): string {
  return `/app/projects/${id}`;
}

export function adminHome(): string {
  return "/admin";
}

export function adminProject(id: string): string {
  return `/admin/projects/${id}`;
}

export function billingCheckout(projectId?: string, packageId?: PackageId): string {
  return checkoutUrl(projectId, packageId);
}
