import { Product } from "@/data/products";
import ProductCard from "./ProductCard";
import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  products: Product[];
  onResetFilters?: () => void;
}

const ProductGrid = ({ products, onResetFilters }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mb-6">
          <PackageX className="w-10 h-10 text-stone-500" />
        </div>
        <h3 className="text-xl font-semibold text-stone-800 mb-2">
          No products found
        </h3>
        <p className="text-stone-500 mb-6 max-w-md">
          We couldn't find any products matching your current filters. Try adjusting your selections or reset all filters.
        </p>
        {onResetFilters && (
          <Button variant="outline" onClick={onResetFilters}>
            Reset Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-4 gap-2 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
