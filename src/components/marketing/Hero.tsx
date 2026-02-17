import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, FileText, Ruler } from "lucide-react";

export function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden py-16 md:py-24 lg:py-32 bg-bg"
      aria-label="Hero section"
    >
      {/* Background with specific Deep Blue to Charcoal radial gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(36, 56, 74, 0.15) 0%, rgba(11, 13, 16, 0) 70%)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Column: Copy + CTAs */}
          <div className="flex flex-col max-w-2xl lg:max-w-none">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text mb-6 leading-[1.1]">
              Contractor-ready floor plans in days.
            </h1>

            <p className="text-lg md:text-xl text-text-muted mb-2 leading-relaxed font-light">
              Send a sketch, photos, or inspiration. We deliver a clean, scaled layout with dimensions and build notes.
            </p>
            <p className="text-xs text-text-subtle font-medium mb-8 uppercase tracking-wide">
              Not for permits. No stamped drawings.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-3">
              <Link href="/start-project">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto font-bold text-base px-8 h-12 shadow-lg hover:shadow-primary/20"
                >
                  Start Project
                </Button>
              </Link>
              <Link href="/examples">
                <Button
                  variant="ghost"
                  className="w-full sm:w-auto text-text-muted hover:text-text font-medium h-12"
                >
                  Get a sample plan <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <p className="text-sm text-text-subtle mb-10 pl-1">
              Most projects delivered in 3–5 days.
            </p>

            {/* Trust Chips */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Ruler, text: "Scaled layout + dimensions" },
                { icon: FileText, text: "Practical build notes" },
                { icon: Check, text: "1–2 revision rounds" },
              ].map((chip, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs md:text-sm text-text-muted shadow-sm"
                >
                  <chip.icon className="h-3.5 w-3.5 text-primary" />
                  <span>{chip.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Preview Card */}
          <div className="relative w-full max-w-lg lg:max-w-full mx-auto lg:mx-0">
            {/* Abstract UI Representation */}
            <div
              className="relative bg-surface border border-border rounded-[18px] shadow-soft p-6 overflow-hidden aspect-[4/3] flex flex-col"
              style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-soft)" }}
            >
              {/* Header of fake UI */}
              <div className="h-4 w-1/3 bg-surface-2 rounded mb-6 opacity-50"></div>

              <div className="flex-1 flex gap-6">
                {/* Sidebar */}
                <div className="hidden sm:flex flex-col gap-3 w-1/4">
                  <div className="h-2 w-full bg-surface-2 rounded opacity-30"></div>
                  <div className="h-2 w-3/4 bg-surface-2 rounded opacity-30"></div>
                  <div className="h-2 w-full bg-surface-2 rounded opacity-30"></div>
                  <div className="h-2 w-1/2 bg-surface-2 rounded opacity-30"></div>

                  <div className="mt-auto space-y-2">
                    <div className="h-8 w-full bg-surface-2 rounded-md opacity-20"></div>
                    <div className="h-8 w-full bg-surface-2 rounded-md opacity-20"></div>
                  </div>
                </div>

                {/* Main Content Area (The Plan) */}
                <div className="flex-1 bg-bg/50 rounded-lg border border-border/50 relative p-4">
                  {/* Floor plan lines */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 border-2 border-text-muted/20">
                    <div className="absolute top-0 left-0 w-1/2 h-full border-r-2 border-text-muted/20"></div>
                    <div className="absolute top-1/2 left-0 w-full h-1/2 border-t-2 border-text-muted/20"></div>
                    {/* Door swing */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-full transform -translate-y-full"></div>
                  </div>

                  {/* Highlights */}
                  <div className="absolute top-[20%] right-[20%] w-6 h-6 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  </div>
                  <div className="absolute bottom-[30%] left-[30%] w-24 h-6 rounded bg-surface border border-border flex items-center justify-center shadow-sm">
                    <span className="text-[10px] text-text-muted">12&apos; - 6&quot;</span>
                  </div>
                </div>
              </div>

              {/* Floating "Delivered" Badge */}
              <div className="absolute bottom-6 right-6 bg-surface-2 border border-border px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <div className="h-2 w-16 bg-text rounded mb-1 opacity-80"></div>
                  <div className="h-1.5 w-10 bg-text-muted rounded opacity-50"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

