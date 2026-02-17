import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function DeliverablesList({
  deliverables,
}: {
  deliverables: Array<{ id: string; title: string; version: number; published_at: string | null }>;
}) {
  return (
    <Card variant="outlined" className="p-10 max-w-3xl mx-auto bg-surface shadow-lg" aria-label="Project intake wizard">
      <h3 className="text-heading-sm font-bold text-text-primary mb-8 tracking-tight">Deliverables</h3>
      <ul className="grid gap-6">
        {deliverables.length === 0 ? (
          <li className="text-body-md text-text-secondary italic">No deliverables published yet.</li>
        ) : null}
        {deliverables.map((item) => (
          <li className="flex items-center justify-between rounded-2xl border border-border/60 bg-surface-alt/20 p-5 transition-all hover:bg-surface-alt/40 group cursor-default" key={item.id}>
            <div className="flex flex-col">
              <span className="text-body-md font-bold text-text-primary group-hover:text-primary transition-colors">
                {item.title}
              </span>
              <span className="text-[0.625rem] text-text-secondary/60 font-bold uppercase tracking-[0.15em] mt-1.5 flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-border" />
                Version {item.version}
              </span>
            </div>
            <Badge variant={item.published_at ? "success" : "neutral"} size="sm">
              {item.published_at ? "Published" : "Draft"}
            </Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
