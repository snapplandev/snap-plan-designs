import { Card } from "@/components/ui/card";

const galleryItems = [
  "Kitchen Remodel Draft",
  "Basement Reflow Layout",
  "Primary Suite Reconfiguration",
  "Open Concept Conversion",
  "ADU Feasibility Plan",
  "Garage Conversion Study",
];

export function GalleryGrid() {
  return (
    <section className="main-container py-24" aria-label="Example gallery">
      <h2 className="text-display-sm font-bold text-text-primary">Example outputs</h2>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((item) => (
          <Card variant="interactive" className="p-6 flex flex-col group" key={item}>
            <div className="aspect-[4/3] rounded-xl bg-surface-alt border border-border/50 transition-all group-hover:bg-surface-alt/80" />
            <h3 className="mt-5 text-heading-sm font-bold text-text-primary leading-tight">{item}</h3>
          </Card>
        ))}
      </div>
    </section>
  );
}
