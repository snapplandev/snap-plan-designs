import { z } from "zod";

export const projectIdSchema = z.string().min(1);

export const projectSchema = z.object({
  id: projectIdSchema,
  name: z.string().min(1),
});

export type ProjectInput = z.infer<typeof projectSchema>;
