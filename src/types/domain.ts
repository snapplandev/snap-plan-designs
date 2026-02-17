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

export type Project = ProjectSummary & {
  property_type: string | null;
  scope_summary: string | null;
  user_id: string;
  package_id: string | null;
  updated_at: string;
};

export type UserPreferences = {
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    push: boolean;
  };
};

export type NotificationType = "project_update" | "new_message" | "system_alert";

export type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  data: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
};
