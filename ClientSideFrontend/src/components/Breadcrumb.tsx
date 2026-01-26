import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      <Link
        href="/"
        className="flex items-center gap-1 text-stone-500 hover:text-stone-800 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only sm:not-sr-only">Home</span>
      </Link>
      
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-stone-500/50" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-stone-500 hover:text-stone-800 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-stone-800 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
