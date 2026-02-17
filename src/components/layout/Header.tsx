"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Examples", href: "/examples" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "/faq" },
  ];

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full border-b border-border transition-all duration-300"
        style={{
          backgroundColor: "rgba(11, 13, 16, 0.72)",
          backdropFilter: "blur(10px)",
          height: "80px",
        }}
        aria-label="Site header"
      >
        <div className="container mx-auto h-full px-4 md:px-6 flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" aria-label="Snap Plan Designs home" className="flex items-center shrink-0">
            <span className="text-xl font-bold tracking-tight text-text">
              Snap Plan Designs
            </span>
          </Link>

          {/* Center: Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-all duration-200 relative py-1",
                    isActive
                      ? "text-text"
                      : "text-text-muted hover:text-text"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <Link href="/login">
              <Button variant="secondary" size="sm" className="h-[44px]">
                Sign in
              </Button>
            </Link>
            <Link href="/start-project">
              <Button size="sm" variant="primary" className="h-[44px] px-6">
                Start Project
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-text-muted hover:text-text transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-[300px] h-full bg-bg border-l border-border shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-bold text-text">Menu</span>
              <button
                className="p-2 -mr-2 text-text-muted hover:text-text transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-lg font-medium transition-colors",
                      isActive ? "text-text" : "text-text-muted hover:text-text"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto flex flex-col gap-4 border-t border-border pt-6">
              <Link href="/login" className="w-full">
                <Button variant="secondary" className="w-full justify-center">
                  Sign in
                </Button>
              </Link>
              <Link href="/start-project" className="w-full">
                <Button variant="primary" className="w-full justify-center">
                  Start Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
