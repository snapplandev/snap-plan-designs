"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertBanner } from "@/components/ui/alert-banner";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Types ---

type AuthView = "login" | "signup" | "forgot-password" | "reset-password";

interface AuthProps {
    initialView?: AuthView;
    className?: string;
}

// --- Icons ---

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
            fill="currentColor"
            d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
        />
    </svg>
);

// --- Component ---

export function AuthFlow({ initialView = "login", className }: AuthProps) {
    const router = useRouter();
    const [view, setView] = React.useState<AuthView>(initialView);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [showPassword, setShowPassword] = React.useState(false);

    // Form refs
    const emailRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);
    const confirmRef = React.useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Simulate API logic
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Basic Validation Simulation
            const email = emailRef.current?.value;
            const password = passwordRef.current?.value;

            if (!email || !email.includes('@')) throw new Error("Invalid email address");
            if (view !== 'forgot-password' && (!password || password.length < 8)) throw new Error("Password must be at least 8 characters");

            if (view === 'signup' && password !== confirmRef.current?.value) {
                throw new Error("Passwords do not match");
            }

            // Success Transition
            if (view === 'login' || view === 'signup') {
                router.push('/dashboard');
            } else {
                setView('login'); // Or show success message
                alert("Check your email for reset instructions.");
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : "Authentication failed");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePassword = () => setShowPassword(!showPassword);

    return (
        <div className={cn("grid lg:grid-cols-2 min-h-[600px] rounded-2xl overflow-hidden border border-border bg-surface shadow-xl", className)}>
            {/* Branding Section */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-surface-alt relative overflow-hidden">
                <div className="z-10 relative">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
                        <span className="text-xl font-bold text-primary">S</span>
                    </div>
                    <h2 className="text-display-lg font-bold mb-4">
                        {view === 'signup' ? "Join the future." : "Welcome back."}
                    </h2>
                    <p className="text-body-lg text-text-muted max-w-sm">
                        Enterprise-grade tools for modern engineering teams. Monitor, deploy, and scale with ease.
                    </p>
                </div>

                {/* Abstract Visual */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-10 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-full blur-3xl transform rotate-12 scale-75 animate-pulse duration-[10s]" />
                </div>

                <div className="z-10 relative">
                    <p className="text-caption text-text-muted">© 2024 Snap Plan Designs. All rights reserved.</p>
                </div>
            </div>

            {/* Form Section */}
            <div className="p-8 md:p-12 flex flex-col justify-center animate-in slide-in-from-right duration-500">
                <div className="mb-8">
                    <h1 className="text-heading-md font-bold mb-1">
                        {view === 'login' && "Sign in to your account"}
                        {view === 'signup' && "Create your account"}
                        {view === 'forgot-password' && "Reset your password"}
                    </h1>
                    <p className="text-body-md text-text-muted">
                        {view === 'login' || view === 'signup'
                            ? "Enter your details below to continue."
                            : "We'll send you a link to reset it."
                        }
                    </p>
                </div>

                {error && (
                    <AlertBanner variant="error" className="mb-6">
                        {error}
                    </AlertBanner>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            ref={emailRef}
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    {view !== 'forgot-password' && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                {view === 'login' && (
                                    <button
                                        type="button"
                                        onClick={() => setView('forgot-password')}
                                        className="text-caption font-medium text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <Input
                                    ref={passwordRef}
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePassword}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    )}

                    {view === 'signup' && (
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    ref={confirmRef}
                                    id="confirm-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <Button className="w-full mt-4" disabled={isLoading}>
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        {view === 'login' && "Sign In"}
                        {view === 'signup' && "Create Account"}
                        {view === 'forgot-password' && "Send Reset Link"}
                        {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                </form>

                {view !== 'forgot-password' && (
                    <>
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-caption uppercase">
                                <span className="bg-surface px-2 text-text-muted">Or continue with</span>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full" disabled={isLoading}>
                            <GoogleIcon />
                            <span className="ml-2">Google</span>
                        </Button>
                    </>
                )}

                <div className="mt-8 text-center text-caption">
                    {view === 'login' ? (
                        <>
                            Don&apos;t have an account?{" "}
                            <button
                                onClick={() => setView('signup')}
                                className="font-semibold text-primary hover:underline"
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                onClick={() => setView('login')}
                                className="font-semibold text-primary hover:underline"
                            >
                                Sign in
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
