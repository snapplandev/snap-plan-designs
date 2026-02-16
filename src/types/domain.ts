export type UserRole = "customer" | "admin";

export type OrderStatus = "pending" | "paid" | "failed" | "refunded";

export type ProjectStatus =
  | "draft"
  | "queued"
  | "in_progress"
  | "needs_info"
  | "delivered"
  | "closed";

export type AssetType = "sketch" | "photo" | "inspiration" | "other";

export type DeliverableKind = "plan" | "notes" | "other";

export type RevisionStatus = "open" | "in_progress" | "resolved" | "rejected";

export type ProductPackage = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  currency: string;
  includes: string[];
  sla_hours: number;
  stripe_price_id: string | null;
};

export type ProjectSummary = {
  id: string;
  title: string;
  status: ProjectStatus;
  created_at: string;
  address_city: string | null;
  address_state: string | null;
};
