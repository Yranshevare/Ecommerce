import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Sparkles, WashingMachine, Truck, BadgePercent, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const categories = [
    {
        title: "Bedsheets",
        description: "Soft, breathable cotton sheets for restful nights",
        image: "/category-bedsheets.jpg",
        href: "/products?category=bedsheets",
    },
    {
        title: "Pillow Covers",
        description: "Elegant designs for every bedroom style",
        image: "/category-pillows.jpg",
        href: "/products?category=pillow-covers",
    },
    {
        title: "Sofa Covers",
        description: "Protect and refresh your living space",
        image: "/category-sofa.jpg",
        href: "/products?category=sofa-covers",
    },
];

const products = [
    {
        id: 1,
        name: "Classic Cotton Bedsheet Set",
        price: 89,
        originalPrice: 120,
        image: "/product-1.jpg",
        category: "Bedsheets",
    },
    {
        id: 2,
        name: "Linen Pillow Cover Duo",
        price: 45,
        image: "/product-2.jpg",
        category: "Pillow Covers",
    },
    {
        id: 3,
        name: "Premium Sofa Slipcover",
        price: 149,
        originalPrice: 189,
        image: "/product-3.jpg",
        category: "Sofa Covers",
    },
    {
        id: 4,
        name: "Luxury Duvet Cover Set",
        price: 129,
        image: "/product-4.jpg",
        category: "Bedsheets",
    },
];

const features = [
    {
        icon: Sparkles,
        title: "Premium Fabric",
        description: "100% organic cotton and linen sourced from the finest mills",
    },
    {
        icon: WashingMachine,
        title: "Easy Wash & Care",
        description: "Machine washable fabrics that stay soft wash after wash",
    },
    {
        icon: Truck,
        title: "Fast Delivery",
        description: "Free shipping on orders over $75 with 3-5 day delivery",
    },
    {
        icon: BadgePercent,
        title: "Affordable Pricing",
        description: "Luxury quality at prices that won't break the bank",
    },
];

const testimonials = [
    {
        name: "Sarah Mitchell",
        location: "New York",
        rating: 5,
        text: "The bedsheets are incredibly soft and have held up beautifully after multiple washes. Best purchase I've made for my bedroom!",
    },
    {
        name: "James Chen",
        location: "Los Angeles",
        rating: 5,
        text: "Finally found sofa covers that actually fit well and look elegant. The quality exceeded my expectations.",
    },
    {
        name: "Emily Roberts",
        location: "Chicago",
        rating: 5,
        text: "Love the pillow covers! The neutral tones match perfectly with my décor. Already ordered more for the guest room.",
    },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-stone-50">
            <Header />
            <main>
                {/* hero section */}
                <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img src={"./hero-bedroom.jpg"} alt="Luxurious bedroom with premium bedding" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-stone-50/80 via-stone-50/40 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="container relative z-10 lg:px-20 px-5">
                        <div className="max-w-xl animate-[fadeUp_0.6s_ease-out_forwards]">
                            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-emerald-100 text-emerald-700 rounded-full">
                                New Collection 2024
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-stone-800 leading-tight mb-6">
                                Comfort That Feels Like Home
                            </h1>
                            <p className="text-lg md:text-xl text-stone-500 mb-8 max-w-md">
                                Premium fabrics crafted for lasting comfort. Experience the luxury of everyday living with our curated home
                                essentials.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="hero" size="xl">
                                    <Link href={"#collection"}>Shop Collection</Link>
                                </Button>
                                <Button variant="hero-outline" size="xl">
                                    <Link href={"/products"}>Explore More</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories section */}
                <section id="collection" className="py-20 lg:px-20 px-5 bg-stone-50">
                    <div className=" w-full">
                        <div  className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-stone-800 mb-4">Shop by Category</h2>
                            <p className="text-stone-500 max-w-md mx-auto">Find the perfect pieces to transform your home into a cozy sanctuary</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {categories.map((category, index) => (
                                <Link
                                    key={category.title}
                                    href={category.href}
                                    className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-500"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={category.image}
                                            alt={category.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-800/70 via-stone-800/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-stone-50">
                                        <h3 className="text-2xl font-serif font-semibold mb-2">{category.title}</h3>
                                        <p className="text-stone-50/80 text-sm">{category.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FeaturedProducts section */}
                <section className="py-20 bg-stone-100/50 lg:px-20 px-5">
                    <div className="w-full">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-serif font-semibold text-stone-800 mb-4">Featured Products</h2>
                                <p className="text-stone-500 max-w-md">Our most loved pieces, handpicked for quality and comfort</p>
                            </div>
                            <Link href="/products" className="mt-4 md:mt-0 text-emerald-700 font-medium hover:underline underline-offset-4">
                                View All Products →
                            </Link>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="aspect-square overflow-hidden bg-stone-100">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">{product.category}</span>
                                        <h3 className="text-base font-medium text-stone-800 mt-1 mb-3 line-clamp-2">{product.name}</h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-lg font-semibold text-stone-800">RS {product.price}</span>
                                            {product.originalPrice && (
                                                <span className="text-sm text-stone-500 line-through">RS {product.originalPrice}</span>
                                            )}
                                        </div>
                                        <Link href={`/products`}>
                                            <Button variant="product" className="w-full" size="default">
                                                <ShoppingCart className="h-4 w-4" />
                                                Explore More
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* WhyChooseUs section */}
                <section className="py-20 bg-stone-50 lg:px-20 px-5">
                    <div className="w-full">
                        <div className="text-center mb-14">
                            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-stone-800 mb-4">Why Choose Nestora</h2>
                            <p className="text-stone-500 max-w-md mx-auto">We believe everyone deserves comfort without compromise</p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <div key={feature.title} className="text-center group">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mb-5 transition-all duration-300 group-hover:bg-emerald-700 group-hover:text-stone-50">
                                        <feature.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-stone-800 mb-2">{feature.title}</h3>
                                    <p className="text-stone-500 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials section */}
                <section className="py-20 lg:px-20 px-5 bg-amber-50">
                    <div className="w-full">
                        <div className="text-center mb-14">
                            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-stone-800 mb-4">What Our Customers Say</h2>
                            <div className="flex items-center justify-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-emerald-700 text-emerald-700" />
                                ))}
                            </div>
                            <p className="text-stone-500">Trusted by over 10,000 happy customers</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.name} className="bg-white p-8 rounded-2xl shadow-md">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-emerald-700 text-emerald-700" />
                                        ))}
                                    </div>
                                    <p className="text-stone-800 mb-6 leading-relaxed">"{testimonial.text}"</p>
                                    <div>
                                        <p className="font-semibold text-stone-800">{testimonial.name}</p>
                                        <p className="text-sm text-stone-500">{testimonial.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
