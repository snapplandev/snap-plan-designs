"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/auth/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async () => {
    setPending(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setPending(false);
      return;
    }

    router.push("/portal");
    router.refresh();
  };

  return (
    <main className="grid min-h-screen place-items-center p-6" aria-label="Sign up page">
      <section className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-white p-6">
        <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
        <div className="mt-5 grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="full-name">Full name</Label>
            <Input id="full-name" onChange={(event) => setFullName(event.currentTarget.value)} value={fullName} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" onChange={(event) => setEmail(event.currentTarget.value)} type="email" value={email} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              onChange={(event) => setPassword(event.currentTarget.value)}
              type="password"
              value={password}
            />
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <Button aria-label="Sign up" disabled={pending} onClick={() => void onSubmit()} type="button">
            {pending ? "Creating..." : "Create account"}
          </Button>
        </div>
        <p className="mt-4 text-sm text-neutral-700">
          Already have an account? <Link className="underline" href="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}
