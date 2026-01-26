"use client";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

const Cart = () => {
    const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();

    const breadcrumbItems = [{ label: "Cart" }];

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#FAF9F6]">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb items={breadcrumbItems} />

                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-[#E8E4DC] rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-12 h-12 text-[#6B7B6E]" />
                        </div>
                        <h1 className="text-3xl font-semibold text-[#2C3E2D] mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                            Your cart is empty
                        </h1>
                        <p className="text-[#6B7B6E] mb-8 max-w-md mx-auto">
                            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
                        </p>
                        <Link href="/products">
                            <Button className="bg-[#2C3E2D] hover:bg-[#1a2a1b] text-white px-8 py-3 rounded-lg">Continue Shopping</Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF9F6]">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Breadcrumb items={breadcrumbItems} />

                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-semibold text-[#2C3E2D] mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                            Shopping Cart
                        </h1>
                        <p className="text-[#6B7B6E]">
                            {items.length} {items.length === 1 ? "item" : "items"} in your cart
                        </p>
                    </div>
                    <Button variant="ghost" onClick={clearCart} className="text-[#6B7B6E] hover:text-red-600 hover:bg-red-50">
                        Clear Cart
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={`${item.product.id}`} className="bg-white rounded-xl p-4 md:p-6 shadow-sm flex flex-col sm:flex-row gap-4">
                                {/* Product Image */}
                                <Link href={`/product/${item.product.id}`} className="flex-shrink-0">
                                    <img
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        className="w-full sm:w-32 h-32 object-cover rounded-lg hover:opacity-90 transition-opacity"
                                    />
                                </Link>

                                {/* Product Details */}
                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <Link
                                                href={`/product/${item.product.id}`}
                                                className="text-lg font-medium text-[#2C3E2D] hover:text-[#6B7B6E] transition-colors"
                                                style={{ fontFamily: "Playfair Display, serif" }}
                                            >
                                                {item.product.name}
                                            </Link>
                                            <p className="text-sm text-[#6B7B6E] capitalize">{item.product.category.replace("-", " ")}</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.product.id)}
                                            className="p-2 text-[#6B7B6E] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* <div className="flex items-center gap-2 mb-4">
                                        <span className="text-xs bg-[#F5F3EE] text-[#6B7B6E] px-2 py-1 rounded">Size: {item.selectedSize}</span>
                                        <span className="text-xs bg-[#F5F3EE] text-[#6B7B6E] px-2 py-1 rounded capitalize">{item.product.color}</span>
                                    </div> */}

                                    <div className="mt-auto flex items-center justify-between">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3 bg-[#F5F3EE] rounded-lg p-1">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center text-[#2C3E2D] hover:bg-white rounded-md transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-medium text-[#2C3E2D]">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-[#2C3E2D] hover:bg-white rounded-md transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-[#2C3E2D]">
                                                ${(parseInt(item.product.price) * item.quantity).toFixed(2)}
                                            </p>
                                            {item.quantity > 1 && <p className="text-sm text-[#6B7B6E]">${item.product.price} each</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Continue Shopping */}
                        <Link href="/products" className="inline-flex items-center gap-2 text-[#6B7B6E] hover:text-[#2C3E2D] transition-colors mt-4">
                            <ArrowLeft className="w-4 h-4" />
                            Continue Shopping
                        </Link>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                            <h2 className="text-xl font-semibold text-[#2C3E2D] mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-[#6B7B6E]">
                                    <span>Subtotal</span>
                                    <span>RS {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[#6B7B6E]">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-[#6B7B6E]">
                                    <span>GST</span>
                                    <span>Included in subtotal</span>
                                </div>
                                <div className="border-t border-[#E8E4DC] pt-4">
                                    <div className="flex justify-between text-lg font-semibold text-[#2C3E2D]">
                                        <span>Total</span>
                                        <span>RS {subtotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <Link href="/Checkout">
                                <Button className="w-full bg-[#2C3E2D] hover:bg-[#1a2a1b] text-white py-3 rounded-lg mb-4">
                                    Proceed to Checkout
                                </Button>
                            </Link>

                            {/* Promo Code */}
                            {/* <div className="mt-6">
                                <label className="text-sm text-[#6B7B6E] mb-2 block">Promo Code</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter code"
                                        className="flex-1 px-4 py-2 border border-[#E8E4DC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B7B6E] text-[#2C3E2D]"
                                    />
                                    <Button variant="outline" className="border-[#2C3E2D] text-[#2C3E2D] hover:bg-[#2C3E2D] hover:text-white">
                                        Apply
                                    </Button>
                                </div>
                            </div> */}

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t border-[#E8E4DC]">
                                <div className="flex items-center justify-center gap-4 text-xs text-[#6B7B6E]">
                                    <span>🔒 Secure Checkout</span>
                                    <span>📦 Free Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Cart;
