import type { ProductPackage } from "@/types/domain";

export function ComparisonTable({ packages }: { packages: ProductPackage[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border shadow-sm bg-surface" aria-label="Package comparison">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-b border-border bg-surface-alt/50">
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-text-secondary">Package</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-text-secondary">SLA (hours)</th>
              <th className="px-6 py-4 text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-text-secondary">Includes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {packages.map((pkg) => (
              <tr
                className="transition-colors hover:bg-surface-alt/20 group"
                key={pkg.id}
              >
                <td className="px-6 py-5">
                  <span className="text-body-md font-bold text-text-primary group-hover:text-primary transition-colors">
                    {pkg.name}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-body-md font-medium text-text-primary">
                    {pkg.sla_hours}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-body-md text-text-secondary leading-relaxed">
                    {pkg.includes.join(" • ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
