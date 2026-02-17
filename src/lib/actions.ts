"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/auth/server";
import {
    messageSchema,
    profileUpdateSchema,
    projectCreateSchema,
    projectUpdateSchema,
    type checkoutSchema,
} from "@/lib/validators/schemas";
import { ensureProjectThread } from "@/lib/db/queries";

export type ActionState = {
    success: boolean;
    message?: string;
    errors?: Record<string, string[]>;
};

export async function createProject(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "Unauthorized" };
    }

    const rawData = {
        title: formData.get("title"),
        propertyType: formData.get("propertyType"),
        scopeSummary: formData.get("scopeSummary"),
        addressCity: formData.get("addressCity"),
        addressState: formData.get("addressState"),
    };

    const validated = projectCreateSchema.safeParse(rawData);

    if (!validated.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: validated.error.flatten().fieldErrors,
        };
    }

    const { error } = await supabase.from("projects").insert({
        user_id: user.id,
        title: validated.data.title,
        property_type: validated.data.propertyType,
        scope_summary: validated.data.scopeSummary,
        address_city: validated.data.addressCity,
        address_state: validated.data.addressState,
        status: "draft",
    });

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath("/portal/projects");
    return { success: true, message: "Project created successfully" };
}

export async function updateProjectIntake(
    projectId: string,
    data: z.infer<typeof projectUpdateSchema>["intake"],
): Promise<ActionState> {
    const supabase = await createSupabaseServerClient();

    // Verify access (RLS will handle row access, but we check user session)
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "Unauthorized" };
    }

    if (!data) return { success: false, message: "No data provided" };

    const { error } = await supabase
        .from("project_intake")
        .upsert({
            project_id: projectId,
            goals: data.goals ?? {},
            constraints: data.constraints ?? {},
            style_refs: data.styleRefs ?? [],
            priority_rooms: data.priorityRooms ?? [],
            notes: data.notes,
        })
        .select();

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath(`/portal/projects/${projectId}`);
    return { success: true, message: "Intake updated" };
}

export async function sendMessage(
    projectId: string,
    data: z.infer<typeof messageSchema>,
): Promise<ActionState> {
    const supabase = await createSupabaseServerClient();
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) return { success: false, message: "Unauthorized" };

    // Ensure thread exists
    let threadId: string;
    try {
        threadId = await ensureProjectThread(projectId);
    } catch {
        return { success: false, message: "Failed to access message thread" };
    }

    // Determine sender role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    const role = profile?.role || "customer";

    const { error } = await supabase.from("messages").insert({
        thread_id: threadId,
        sender_role: role,
        body: data.body,
        attachments: data.attachments ?? [],
    });

    if (error) return { success: false, message: error.message };

    // Trigger notification for the other party (simplified logic)
    // In a real app, we'd check who the thread belongs to and notify them if they aren't the sender.
    // For now, we rely on Realtime subscriptions on the client.

    revalidatePath(`/portal/projects/${projectId}`);
    return { success: true, message: "Message sent" };
}

export async function updateProfile(data: z.infer<typeof profileUpdateSchema>): Promise<ActionState> {
    const supabase = await createSupabaseServerClient();
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) return { success: false, message: "Unauthorized" };

    const updates: Record<string, unknown> = {};
    if (data.fullName) updates.full_name = data.fullName;
    if (data.preferences) updates.preferences = data.preferences;

    if (Object.keys(updates).length === 0) return { success: true };

    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);

    if (error) return { success: false, message: error.message };

    revalidatePath("/portal/profile");
    return { success: true, message: "Profile updated" };
}
