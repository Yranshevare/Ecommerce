"use client";
import { useEffect, useState } from "react";
import { ShoppingCart, Heart, Truck, Shield, RotateCcw, Minus, Plus, ChevronLeft, ChevronRight, Loader, MoveLeft, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, products } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import RenderDetails from "@/components/RenderDetails";

const ProductDetail = ({ params }: { params: Promise<{ id: string }> }) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [Loading, setLoading] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [details, setDetails] = useState<string>("");
    const [showFullDescription, setShowFullDescription] = useState(false);

    const { addToCart } = useCart();
    const { toast } = useToast();

    useEffect(() => {
        (async function () {
            const { id } = await params;
            const res = await axios.get(`/api/Product/getOne?id=${id}`);
            console.log(res.data.data);
            setProduct(res.data.data.products);
            setLoading(true);
            setRelatedProducts(res.data.data.category.product.filter((p: Product) => p.id !== id));
            setDetails(res.data.data.category.details);
        })();
    }, []);

    if (!Loading) {
        return (
            <div className="min-h-screen bg-stone-50 ">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <span className="flex items-center justify-center">
                        <Loader className="animate-spin text-stone-800" />
                    </span>
                    <h1 className="text-2xl font-semibold text-stone-800 mb-4">Product id Loading</h1>
                    <p className="text-stone-600 mb-8">This may take a moment.</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-stone-50 ">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-semibold text-stone-800 mb-4">Product Not Found</h1>
                    <p className="text-stone-600 mb-8">The product you're looking for doesn't exist.</p>
                    <Link href="/products">
                        <Button variant="hero">Browse Products</Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    // Simulate multiple images using the same image
    const images = product.images;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast({
            description: `${quantity} x ${product.name}  added to your cart.`,
        });
    };

    return (
        <div className="min-h-screen  bg-stone-50 ">
            <Header />

            <main className="flex flex-col justify-center items-center mx-auto lg:px-20 px-5 py-8 ">
                <div className="w-full justify-start">
                    <Link href={"/products"} className="text-gray-500 hover:text-gray-800 font-medium duration-300 flex gap-2 items-center">
                        <ArrowLeft className="translate-y-0.4 w-5"/>
                        Go back
                    </Link>
                </div>
                {/* Product Section */}
                <div className="grid md:grid-cols-2 max-w-[1000px] gap-12 mt-8">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-md">
                            <img src={images[currentImageIndex]} alt={product.name} className="w-full h-full object-cover" />

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-stone-800" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-stone-800" />
                            </button>
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="flex gap-3">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                                        currentImageIndex === index ? "border-emerald-700 shadow-md" : "border-transparent hover:border-stone-300"
                                    }`}
                                >
                                    <img src={img} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Title */}
                        <h1 className="text-3xl lg:text-4xl font-semibold text-stone-800 font-['Playfair_Display']">{product.name}</h1>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">{product.category}</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-semibold text-stone-800">₹{product.price}</span>

                            {Number(product.discount) > 0 && (
                                <>
                                    <span className="text-sm text-stone-500 line-through">
                                        ₹{Math.round(Number(product.price) / (1 - Number(product.discount) / 100))}
                                    </span>

                                    <span className="text-xs font-medium text-red-500">{product.discount}% OFF</span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-stone-600 leading-relaxed text-justify">
                            {showFullDescription ? (
                                <>
                                    <p>{product.description}</p>
                                    <button className="text-black font-medium text-xs cursor-pointer" onClick={() => setShowFullDescription((prev) => !prev)}>
                                        {" "}
                                        Read Less
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p>{product.description.slice(0, 100)}</p>
                                    <button className="text-black font-medium text-xs cursor-pointer" onClick={() => setShowFullDescription((prev) => !prev)}>
                                        {product.description.length > 100 ? "...Read More" : "Read Less"}
                                    </button>
                                </>
                            )}
                        </p>
                        <div className="w-full flex flex-col gap-3">
                            {Object.entries(product.specification).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-2 gap-3">
                                    <span className="lg:text-xl font-medium text-stone-800">{key}</span>
                                    <span className="lg:text-xl text-stone-500">{value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center justify-between border-2 border-stone-200 rounded-xl">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 flex items-center justify-center text-stone-600 hover:text-stone-800 transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-semibold text-stone-800">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 flex items-center justify-center text-stone-600 hover:text-stone-800 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Add to Cart */}
                            <Button variant="product" size="lg" className="flex-1 sm:h-12 sm:py-0 py-5" onClick={handleAddToCart}>
                                <ShoppingCart className="w-5 h-5" />
                                <span className="ml-2">Add to Cart</span>
                            </Button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200">
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto bg-stone-100 rounded-full flex items-center justify-center mb-2">
                                    <Truck className="w-5 h-5 text-stone-600" />
                                </div>
                                <p className="text-xs text-stone-600">Free Shipping</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto bg-stone-100 rounded-full flex items-center justify-center mb-2">
                                    <RotateCcw className="w-5 h-5 text-stone-600" />
                                </div>
                                <p className="text-xs text-stone-600">30-Day Returns</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto bg-stone-100 rounded-full flex items-center justify-center mb-2">
                                    <Shield className="w-5 h-5 text-stone-600" />
                                </div>
                                <p className="text-xs text-stone-600">2-Year Warranty</p>
                            </div>
                        </div>
                    </div>
                </div>

                {details && (
                    <section className="mt-20 w-full max-w-[1000px]">
                        <RenderDetails details={details} />
                    </section>
                )}
                {/* Recommended Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-20 w-full max-w-[1200px]">
                        <h2 className="text-lg! lg:text-2xl font-semibold text-stone-800 mb-8">Recommended Products</h2>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/product/${item.id}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Image */}
                                    <div className="aspect-square overflow-hidden bg-stone-100">
                                        <img
                                            src={item.images?.[0]}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="p-5">
                                        <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                            {item.category}
                                        </span>

                                        <h3 className="sm:text-base text-[15px]! font-medium text-stone-800 mt-2 mb-2 line-clamp-2">{item.name}</h3>

                                        <div className="flex items-center gap-2">
                                            <span className="sm:text-lg text-xs font-semibold text-stone-800">₹{item.price}</span>

                                            {item.discount && <span className="text-xs font-medium text-red-500">{item.discount}% OFF</span>}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetail;
