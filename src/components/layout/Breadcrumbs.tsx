import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  href: string;
  label: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li className="flex items-center gap-2" key={`${item.href}-${item.label}`}>
              {index > 0 && <ChevronRight className="h-4 w-4 text-text-secondary/40" aria-hidden="true" />}
              {isLast ? (
                <span className="text-caption font-bold text-text-primary" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-caption font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
