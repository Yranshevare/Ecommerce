"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CreditCard, Truck, Shield, Check, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { supabase } from "@/lib/supabaseClient";

const Checkout = () => {
    const router = useRouter();
    const { items, subtotal, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const { toast } = useToast();
    console.log("user", user);

    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [saveAddress, setSaveAddress] = useState(false);

    const [formData, setFormData] = useState({
        email: user?.email || "",
        name: user?.name || "",
        phone: user?.phone || "",
        address: "",
        apartment: "",
        city: "",
        state: "",
        zipCode: "",
        cardNumber: "",
        cardExpiry: "",
        cardCvc: "",
        cardName: "",
    });
    useEffect(() => {
        setFormData((prev) => ({ ...prev, email: user?.email || "", name: user?.name || "", phone: user?.phone || "" }));
    }, [user]);

    useEffect(() => {
        if (localStorage.getItem("shippingAddress")) {
            const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress") || "");
            setFormData((prev) => ({ ...prev, ...shippingAddress }));
        }
    }, []);

    // const shipping = subtotal > 100 ? 0 : 9.99;
    // const tax = subtotal * 0.08;
    // const total = subtotal + shipping + tax;

    const breadcrumbItems = [{ label: "Cart", href: "/cart" }, { label: "Checkout" }];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setIsProcessing(true);
            if (!isAuthenticated) {
                toast({
                    title: "You are not logged in",
                    description: "Please log in to place an order.",
                    variant: "destructive",
                });
                setIsProcessing(false);
                return;
            }
            const {
                data: { session },
            } = await supabase.auth.getSession();
            const token = session?.access_token;
    
            const productDetails = items.map((item) => ({
                productId: item.product.id,
                price: item.product.price,
                quantity: item.quantity,
            }));
            const payload = {
                products: productDetails,
                fullName: formData.name,
                address: formData.address + ", " + formData.apartment ,
                city: formData.city,
                state: formData.state,
                phone: formData.phone,
                pin: formData.zipCode,
                email: formData.email,
                paymentMethod,
                totalPrice: String(subtotal),
            };
    
            const res = await axios.post(`/api/Order/placeOrder?token=${token}`, payload);
    
            // console.log(res.data);
    
            if (saveAddress) {
                localStorage.setItem(
                    "shippingAddress",
                    JSON.stringify({
                        firstName: formData.name,
                        address: formData.address,
                        apartment: formData.apartment,
                        city: formData.city,
                        state: formData.state,
                        zipCode: formData.zipCode,
                    })
                );
            }
    
            console.log({
                items,
                shippingAddress: {
                    firstName: formData.name,
                    address: formData.address,
                    apartment: formData.apartment,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                },
                paymentMethod,
                subtotal,
            });
            clearCart();
            setIsProcessing(false);
    
            toast({
                title: "Order Placed Successfully!",
                description: "Thank you for your purchase. You will receive a confirmation email shortly.",
            });
        } catch (error) {
            console.error(error);
        }

        // router.push("/profile?tab=orders");
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#FAF9F6]">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb items={breadcrumbItems} />

                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-[#E8E4DC] rounded-full flex items-center justify-center mx-auto mb-6">
                            <CreditCard className="w-12 h-12 text-[#6B7B6E]" />
                        </div>
                        <h1 className="text-3xl font-semibold text-[#2C3E2D] mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                            Your cart is empty
                        </h1>
                        <p className="text-[#6B7B6E] mb-8 max-w-md mx-auto">Add some items to your cart before checking out.</p>
                        <Link href="/products">
                            <Button className="bg-[#2C3E2D] hover:bg-[#1a2a1b] text-white px-8 py-3 rounded-lg">Browse Products</Button>
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

                <div className="flex items-center gap-4 mb-8">
                    <Link href="/cart" className="p-2 text-[#6B7B6E] hover:text-[#2C3E2D] hover:bg-white rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-semibold text-[#2C3E2D]" style={{ fontFamily: "Playfair Display, serif" }}>
                        Checkout
                    </h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Contact Information */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-xl font-semibold text-[#2C3E2D] mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
                                    Contact Information
                                </h2>

                                {!isAuthenticated && (
                                    <p className="text-sm text-[#6B7B6E] mb-4">
                                        Already have an account?{" "}
                                        <Link href="/login" className="text-[#2C3E2D] font-medium hover:underline">
                                            Log in
                                        </Link>
                                    </p>
                                )}

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="">
                                        <Label htmlFor="email" className="text-[#2C3E2D] mb-2 block">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="border-[#E8E4DC] focus:ring-[#6B7B6E] focus:border-[#6B7B6E]"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="name" className="text-[#2C3E2D] mb-2 block w-full">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="border-[#E8E4DC] focus:ring-[#6B7B6E] focus:border-[#6B7B6E]"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone" className="text-[#2C3E2D] mb-2 block w-full">
                                            Phone
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="border-[#E8E4DC] focus:ring-[#6B7B6E] focus:border-[#6B7B6E]"
                                            placeholder="(123) 456-7890"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-xl font-semibold text-[#2C3E2D] mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
                                    Shipping Address
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <Label htmlFor="address" className="text-[#2C3E2D] mb-2 block">
                                            Address
                                        </Label>
                                        <Input
                                            id="address"
                                            name="address"
                                            required
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="border-[#E8E4DC] focus:ring-[#6B7B6E] focus:border-[#6B7B6E]"
                                            placeholder="Street address"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label htmlFor="apartment" className="text-[#2C3E2D] mb-2 block">
                                            Apartment, suite, etc. (optional)
                                        </Label>
                                        <Input
                                            id="apartment"
                                            name="apartment"
                                            value={formData.apartment}
                                            onChange={handleInputChange}
                                            className="border-[#E8E4DC] focus:ring-[#6B7B6E] focus:border-[#6B7B6E]"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="city" className="text-[#2C3E2D] mb-2 block">
                                            City
                                        </Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="border-[#E8E4DC] focus:ring-[#6B7B6E] focus:border-[#6B7B6E]"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="state" className="text-[#2C3E2D] mb-2 block">
                                                State
                                            </Label>
                                            <Input
                                                id="state"
                                                name="state"
                                                required
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className="border-[#E8E4DC] focus:ring-[#6B7B6E] focus:border-[#6B7B6E]"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="zipCode" className="text-[#2C3E2D] mb-2 block">
                                                ZIP Code
                                            </Label>
                                            <Input
                                                id="zipCode"
                                                name="zipCode"
                                                required
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                className="border-[#E8E4DC] focus:ring-[#6B7B6E] focus:border-[#6B7B6E]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-4">
                                    <Checkbox
                                        id="saveAddress"
                                        checked={saveAddress}
                                        onCheckedChange={(checked) => setSaveAddress(checked as boolean)}
                                        className="border-[#E8E4DC] data-[state=checked]:bg-[#2C3E2D]"
                                    />
                                    <Label htmlFor="saveAddress" className="text-sm text-[#6B7B6E] cursor-pointer">
                                        Save this address for future orders
                                    </Label>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-xl font-semibold text-[#2C3E2D] mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
                                    Payment Method
                                </h2>

                                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                                    {/* <div
                                        className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                                            paymentMethod === "card" ? "border-[#2C3E2D] bg-[#F5F3EE]" : "border-[#E8E4DC]"
                                        }`}
                                    >
                                        <RadioGroupItem value="card" id="card" className="border-[#2C3E2D] text-[#2C3E2D]" />
                                        <Label htmlFor="card" className="flex-1 flex items-center gap-3 cursor-pointer">
                                            <CreditCard className="w-5 h-5 text-[#6B7B6E]" />
                                            <span className="text-[#2C3E2D] font-medium">Credit / Debit Card</span>
                                        </Label>
                                        <div className="flex gap-2">
                                            <div className="w-10 h-6 bg-[#E8E4DC] rounded flex items-center justify-center text-xs font-bold text-[#6B7B6E]">
                                                VISA
                                            </div>
                                            <div className="w-10 h-6 bg-[#E8E4DC] rounded flex items-center justify-center text-xs font-bold text-[#6B7B6E]">
                                                MC
                                            </div>
                                        </div>
                                    </div> */}

                                    {/* {paymentMethod === "card" && (
                                        <div className="pl-8 space-y-4">
                                            <div>
                                                <Label htmlFor="cardNumber" className="text-[#2C3E2D] mb-2 block">
                                                    Card Number
                                                </Label>
                                                <Input
                                                    id="cardNumber"
                                                    name="cardNumber"
                                                    required
                                                    value={formData.cardNumber}
                                                    onChange={handleInputChange}
                                                    className="border-[#E8E4DC] focus:ring-[#6B7B6E] focus:border-[#6B7B6E]"
                                                    placeholder="1234 5678 9012 3456"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="cardName" className="text-[#2C3E2D] mb-2 block">
                                                    Name on Card
                                                </Label>
                                                <Input
                                                    id="cardName"
                                                    name="cardName"
                                                    required
                                                    value={formData.cardName}
                                                    onChange={handleInputChange}
                                                    className="border-[#E8E4DC] focus:ring-[#6B7B6E] focus:border-[#6B7B6E]"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="cardExpiry" className="text-[#2C3E2D] mb-2 block">
                                                        Expiry Date
                                                    </Label>
                                                    <Input
                                                        id="cardExpiry"
                                                        name="cardExpiry"
                                                        required
                                                        value={formData.cardExpiry}
                                                        onChange={handleInputChange}
                                                        className="border-[#E8E4DC] focus:ring-[#6B7B6E] focus:border-[#6B7B6E]"
                                                        placeholder="MM/YY"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="cardCvc" className="text-[#2C3E2D] mb-2 block">
                                                        CVC
                                                    </Label>
                                                    <Input
                                                        id="cardCvc"
                                                        name="cardCvc"
                                                        required
                                                        value={formData.cardCvc}
                                                        onChange={handleInputChange}
                                                        className="border-[#E8E4DC] focus:ring-[#6B7B6E] focus:border-[#6B7B6E]"
                                                        placeholder="123"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )} */}

                                    <div
                                        className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                                            paymentMethod === "cod" ? "border-[#2C3E2D] bg-[#F5F3EE]" : "border-[#E8E4DC]"
                                        }`}
                                    >
                                        <RadioGroupItem value="cod" id="cod" className="border-[#2C3E2D] text-[#2C3E2D]" />
                                        <Label htmlFor="cod" className="flex-1 flex items-center gap-3 cursor-pointer">
                                            <Truck className="w-5 h-5 text-[#6B7B6E]" />
                                            <span className="text-[#2C3E2D] font-medium">Cash on Delivery</span>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                                <h2 className="text-xl font-semibold text-[#2C3E2D] mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
                                    Order Summary
                                </h2>

                                {/* Cart Items */}
                                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={`${item.product.id}`} className="flex gap-3">
                                            <div className="relative">
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#2C3E2D] text-white text-xs rounded-full flex items-center justify-center">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-[#2C3E2D] line-clamp-1">{item.product.name}</p>
                                                {/* <p className="text-xs text-[#6B7B6E]">Size: {item.selectedSize}</p> */}
                                                <p className="text-sm font-medium text-[#2C3E2D] mt-1">
                                                    ${(parseInt(item.product.price.value) * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-[#E8E4DC] pt-4 space-y-3">
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
                                    <div className="border-t border-[#E8E4DC] pt-3">
                                        <div className="flex justify-between text-lg font-semibold text-[#2C3E2D]">
                                            <span>Total</span>
                                            <span>RS {subtotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full bg-[#2C3E2D] hover:bg-[#1a2a1b] text-white py-3 rounded-lg mt-6 disabled:opacity-50"
                                >
                                    {isProcessing ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <Check className="w-4 h-4" />
                                            Place Order
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    );
};

export default Checkout;
