import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GalleryGrid } from "@/components/marketing/GalleryGrid";
import { SocialProof } from "@/components/marketing/SocialProof";
import { FAQ } from "@/components/marketing/FAQ";

export default function ExamplesPage() {
  const features = [
    {
      title: "Kitchens & Open-Concept",
      description: "See how we solve traffic flow, sightlines, and work zones—without guesswork."
    },
    {
      title: "Basements & Bonus Rooms",
      description: "Proven layouts for bedrooms, baths, storage, and media spaces with realistic dimensions."
    },
    {
      title: "Additions & Reconfigures",
      description: "Before/after options that clarify what fits, what doesn’t, and what it costs to change."
    }
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative w-full overflow-hidden py-20 md:py-32 bg-black text-white">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="h-full w-full opacity-50"
            style={{ background: "radial-gradient(ellipse at center, #262626, #000000)" }}
          />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Real Before-And-After Plans. Proof. Instant Clarity.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Browse proven layouts built from messy inputs—sketches, photos, and notes—turned contractor-ready in days, every time.
          </p>
          <Link href="#gallery">
            <Button
              size="lg"
              className="bg-[#ffff00] text-black hover:bg-[#ffff00]/90 font-bold text-lg px-8 h-14 rounded-full"
            >
              View Example Plans
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4 md:px-6">
          <GalleryGrid />
        </div>
      </section>

      <SocialProof introLine="Real projects. Real inputs. Real outcomes." />
      <FAQ />
    </>
  );
}
