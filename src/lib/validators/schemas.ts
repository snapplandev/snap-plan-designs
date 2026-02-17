import { z } from "zod";

export const checkoutSchema = z
  .object({
    packageSlug: z.string().min(1).optional(),
    packageId: z.string().uuid().optional(),
  })
  .refine((value) => Boolean(value.packageSlug || value.packageId), {
    message: "packageSlug or packageId is required",
  });

export const projectCreateSchema = z.object({
  title: z.string().min(2),
  propertyType: z.string().min(2).max(80),
  scopeSummary: z.string().min(2).max(2000),
  addressCity: z.string().min(2).max(120),
  addressState: z.string().min(2).max(120),
});

export const projectUpdateSchema = z.object({
  title: z.string().min(2).max(160).optional(),
  status: z
    .enum(["draft", "queued", "in_progress", "needs_info", "delivered", "closed"])
    .optional(),
  intake: z
    .object({
      goals: z.record(z.string(), z.unknown()).optional(),
      constraints: z.record(z.string(), z.unknown()).optional(),
      styleRefs: z.array(z.string()).optional(),
      priorityRooms: z.array(z.string()).optional(),
      notes: z.string().max(3000).optional(),
    })
    .optional(),
});

export const assetSignSchema = z.object({
  type: z.enum(["sketch", "photo", "inspiration", "other"]),
  fileName: z.string().min(1).max(200),
  mimeType: z.string().min(1).max(120),
  sizeBytes: z.number().int().positive().max(50 * 1024 * 1024),
});

export const messageSchema = z.object({
  body: z.string().min(1).max(4000),
  attachments: z.array(z.string()).optional(),
});

export const revisionRequestSchema = z.object({
  reason: z.string().min(5).max(3000),
});

export const deliverableSchema = z.object({
  kind: z.enum(["plan", "notes", "other"]),
  title: z.string().min(2).max(200),
  fileName: z.string().min(1).max(220),
  mimeType: z.string().min(1).max(120),
});

export const profileUpdateSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  preferences: z
    .object({
      theme: z.enum(["light", "dark", "system"]).optional(),
      notifications: z
        .object({
          email: z.boolean().optional(),
          push: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
});
