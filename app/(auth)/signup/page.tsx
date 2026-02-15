"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";

import Button from "@/components/ui/Button";
import { appHome, home, login } from "@/lib/routes";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    const user = data.user;

    if (!user) {
      setErrorMessage("Account was created, but no user session is available yet.");
      setIsSubmitting(false);
      return;
    }

    const { error: profileInsertError } = await supabase.from("profiles").insert({
      id: user.id,
      role: "client",
      full_name: fullName,
      email,
    });

    if (profileInsertError) {
      setErrorMessage(profileInsertError.message);
      setIsSubmitting(false);
      return;
    }

    if (!data.session) {
      setSuccessMessage("Account created. Check your email for the confirmation link.");
    }

    router.push(appHome());
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
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Set up your client workspace in a few steps.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field" htmlFor="full-name">
            <span className="auth-label">Full name</span>
            <input
              id="full-name"
              name="fullName"
              type="text"
              autoComplete="name"
              className="auth-input"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </label>

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
              autoComplete="new-password"
              className="auth-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
            />
          </label>

          {errorMessage ? (
            <p className="auth-message auth-message--error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          {successMessage ? (
            <p className="auth-message auth-message--success" role="status">
              {successMessage}
            </p>
          ) : null}

          <div className="auth-actions">
            <Button type="submit" disabled={isSubmitting} aria-label="Create a Snap Plan Designs account">
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </div>
        </form>

        <p className="auth-footnote">
          Already have an account? <Link href={login()}>Sign in</Link>
        </p>
      </section>
    </main>
  );
}
