"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";

import Button from "@/components/ui/Button";
import { appHome, home, signup } from "@/lib/routes";
import { supabaseBrowser } from "@/lib/supabase/client";

function sanitizeNextPath(nextPath: string | null): string {
  if (!nextPath || !nextPath.startsWith("/")) {
    return appHome();
  }

  return nextPath;
}

function getNextPathFromLocation(): string {
  if (typeof window === "undefined") {
    return appHome();
  }

  const params = new URLSearchParams(window.location.search);
  return sanitizeNextPath(params.get("next"));
}

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    const { data: authData, error: authUserError } = await supabase.auth.getUser();
    if (authUserError) {
      setErrorMessage(authUserError.message);
      setIsSubmitting(false);
      return;
    }

    const authenticatedUser = authData.user;
    if (!authenticatedUser) {
      setErrorMessage("No authenticated user session was found.");
      setIsSubmitting(false);
      return;
    }

    const { data: existingProfile, error: profileLookupError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", authenticatedUser.id)
      .maybeSingle();

    if (profileLookupError) {
      setErrorMessage(profileLookupError.message);
      setIsSubmitting(false);
      return;
    }

    if (!existingProfile) {
      const fullName =
        typeof authenticatedUser.user_metadata?.full_name === "string"
          ? authenticatedUser.user_metadata.full_name
          : null;
      const { error: profileInsertError } = await supabase.from("profiles").insert({
        id: authenticatedUser.id,
        role: "client",
        full_name: fullName,
        email: authenticatedUser.email ?? email,
      });

      if (profileInsertError) {
        setErrorMessage(profileInsertError.message);
        setIsSubmitting(false);
        return;
      }
    }

    router.push(getNextPathFromLocation());
    router.refresh();
  }

  if (!supabase) {
    return (
      <main className="auth-shell">
        <section className="auth-panel" aria-live="polite">
          <h1 className="auth-title">Supabase not configured</h1>
          <p className="auth-message">
            Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local to
            enable authentication.
          </p>
          <p className="auth-footnote">
            <Link href={home()}>Back to home</Link>
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel" aria-live="polite">
        <p className="auth-kicker">Architect&apos;s Study</p>
        <h1 className="auth-title">Sign in</h1>
        <p className="auth-subtitle">Continue to your project workspace.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field" htmlFor="email">
            <span className="auth-label">Email</span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="auth-input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="auth-field" htmlFor="password">
            <span className="auth-label">Password</span>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="auth-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {errorMessage ? (
            <p className="auth-message auth-message--error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <div className="auth-actions">
            <Button type="submit" disabled={isSubmitting} aria-label="Sign in to Snap Plan Designs">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>

        <p className="auth-footnote">
          New here? <Link href={signup()}>Create an account</Link>
        </p>
      </section>
    </main>
  );
}
