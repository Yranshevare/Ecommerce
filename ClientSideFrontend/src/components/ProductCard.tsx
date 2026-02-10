"use client";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { addToCart } = useCart();
    const { toast } = useToast();

    const router = useRouter();

    const handleAddToCart = () => {
        const selectedProduct = { ...product, price: product.price[0] };
        addToCart(selectedProduct, 1);
        toast({
            title: "Added to cart",
            description: `${1} x ${product.name} added to your cart.`,
        });
    };

    return (
        <div
            onClick={() => router.push(`/products/${product.id}`)}
            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300  flex flex-col justify-between"
        >
            <div>
                {/* Image Container */}
                <div className="relative  aspect-square overflow-hidden bg-stone-100 ">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Badges */}
                    {/* <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && <span className="px-2.5 py-1 text-xs font-medium bg-emerald-700 text-stone-50 rounded-full">New</span>}
                    {product.isBestseller && (
                        <span className="px-2.5 py-1 text-xs font-medium bg-stone-800 text-stone-50 rounded-full">Bestseller</span>
                    )}
                    {product.originalPrice && <span className="px-2.5 py-1 text-xs font-medium bg-red-500 text-stone-50 rounded-full">Sale</span>}
                </div> */}

                    {/* Out of Stock Overlay */}
                    {/* {!product.inStock && (
                    <div className="absolute inset-0 bg-stone-50/60 flex items-center justify-center">
                        <span className="px-4 py-2 bg-stone-800 text-stone-50 text-sm font-medium rounded-full">Out of Stock</span>
                    </div>
                )} */}

                    {/* Quick View Button */}
                    <div className="absolute inset-0 bg-stone-800/0 group-hover:bg-stone-800/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button variant="secondary" size="sm" className="gap-2 shadow-lg">
                            <Eye className="w-4 h-4" />
                            Quick View
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="sm:p-5 p-1 flex flex-col justify-between items-start gap-2 ">
                    <div className="min-h-[3rem] mb-2 flex flex-col gap-2">
                        <h3 className="text-base font-medium text-stone-800  line-clamp-2 ">{product.name}</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">{product.category}</span>
                        </div>
                    </div>
                    <p className="sm:text-lg text-xs ">
                        {product.description.slice(0, 80)} {product.description.length > 80 && "..."}
                    </p>

                    {/* Price */}
                    <div className="sm:flex  items-center gap-2 sm:mb-4">
                        <span className="sm:text-lg text-sm font-semibold text-stone-800">₹{product.price[0].value}</span>

                        {Number(product.price[0].discount) > 0 && (
                            <div className="sm:flex-row flex flex-col sm:items-center sm:gap-2">
                                <span className="sm:text-xs text-[10px] text-stone-500 line-through">
                                    ₹{Math.round(Number(product.price[0].value) / (1 - Number(product.price[0].discount) / 100))}
                                </span>

                                <span className="text-xs font-medium text-red-500">{product.price[0].discount}% OFF</span>
                            </div>
                        )}
                    </div>

                    {/* Add to Cart */}
                </div>
            </div>
            <div className="sm:p-5 p-2">
                <Button
                    variant="product"
                    className="w-full"
                    size="default"
                    onClick={(event) => {
                        event.stopPropagation();
                        handleAddToCart();
                    }}
                >
                    <ShoppingCart className="sm:h-4 sm:w-4 h-2 w-2" />
                    <span className="text-[10px]">
                        Add to Cart
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default ProductCard;
