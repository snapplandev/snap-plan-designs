import type { ProductPackage } from "@/types/domain";

export function ComparisonTable({ packages }: { packages: ProductPackage[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-white" aria-label="Package comparison">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
            <th className="px-4 py-3">Package</th>
            <th className="px-4 py-3">SLA (hours)</th>
            <th className="px-4 py-3">Includes</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr className="border-b border-[var(--border)] last:border-0" key={pkg.id}>
              <td className="px-4 py-3 font-medium">{pkg.name}</td>
              <td className="px-4 py-3">{pkg.sla_hours}</td>
              <td className="px-4 py-3">{pkg.includes.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
