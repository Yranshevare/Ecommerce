"use client";

import { useEffect, useState } from "react";
import { User, Package, MapPin, Settings, LogOut, ChevronRight, Truck, CheckCircle, Clock, SplinePointer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
// import {  Order } from "@/data/orders";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { set } from "react-hook-form";

export interface OrderItem {
    productId: string;
    price: { key: string; value: string; discount?: number };
    quantity: number;
    productData: {
        images: string[];
        specification: { [key: string]: string };
        name: string;
    };
}

export interface Order {
    id: string;
    orderNumber: string;
    date: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    products: OrderItem[];
    subtotal: number;
    shipping: number;
    totalPrice: number;
    shippingAddress: {
        name: string;
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    createdAt: string;
    updatedAt: string;
}

const OrderCard = ({ order }: { order: Order }) => {
    const statusConfig = {
        PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
        ACCEPTED: { color: "bg-blue-100 text-blue-800", icon: Truck },
        REJECTED: { color: "bg-red-100 text-red-800", icon: Clock },
    };

    const router = useRouter();
    const StatusIcon = statusConfig[order.status].icon;

    return (
        <div className="bg-white rounded-xl border border-stone-200 hover:shadow-md transition-shadow lg:px-20 px-5 py-10">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b">
                <div>
                    <p className="font-medium">Order Id: {order.id}</p>
                    <p className="text-sm text-stone-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge className={`${statusConfig[order.status].color} flex gap-1`}>
                    <StatusIcon className="h-3 w-3" />
                    {order.status}
                </Badge>
            </div>

            {/* Products */}
            <div className="space-y-4 mb-4">
                {order.products.map((item: OrderItem) => {
                    const { specification } = item.productData;

                    return (
                        <div onClick={() => router.push(`/products/${item.productId}`)} key={item.productId} className="flex  cursor-pointer gap-4">
                            <img src={item.productData.images[0]} className="w-20 h-20 object-cover rounded-lg" alt="product" />

                            <div className="flex-1">
                                <div className="flex">
                                    <p className="font-medium text-stone-800">{item.productData.name} </p>
                                    <span>-</span>
                                    <p>{item.price.key}</p>
                                </div>

                                <p className="text-sm text-stone-500">
                                    {Object.entries(specification)
                                        .map(([key, value]) => `${key}: ${value}`)
                                        .join(" • ")}
                                </p>

                                <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
                            </div>

                            <p className="font-medium">₹{item.price.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="flex justify-between pt-4 border-t">
                <div>
                    <p className="text-sm text-stone-500">Total</p>
                    <p className="text-lg font-semibold">₹{order.totalPrice}</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => router.push(`orders/${order.id}`)} variant="outline" size="sm">
                        View Details
                    </Button>
                </div>
            </div>
        </div>
    );
};

const Profile = () => {
    const { user, logout, updateProfile, isAuthenticated } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("orders");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    // console.log(user?.name)

    // Form state for profile editing
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
    });

    const { data, isLoading, isError } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            setLoading(true);
            const {
                data: { session },
            } = await supabase.auth.getSession();
            const token = session?.access_token;
            console.log("fetching");
            const res = await axios.get(`/api/Order/getAll?token=${token}`);
            setOrders(res.data.data);
            setLoading(false);
            return res.data.data;
        },
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                phone: user.phone || "",
            });
        }
    }, [user]);

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex flex-col bg-stone-50">
                <Header />
                <main className="flex-1 flex items-center justify-center py-12 px-4">
                    <Loader2 className="animate-spin" />
                </main>
                <Footer />
            </div>
        );
    }

    // Redirect if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col bg-stone-50 ">
                <Header />
                <main className="flex-1 flex items-center justify-center py-12 px-4">
                    <div className="text-center">
                        <h1 className="font-serif text-2xl font-semibold text-stone-800 mb-4">Please sign in to view your profile</h1>
                        <Button onClick={() => router.push("/Login")} className="bg-emerald-700 hover:bg-emerald-800">
                            Sign In
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex flex-col bg-stone-50">
                <Header />
                <main className="flex-1 flex items-center justify-center py-12 px-4">
                    <div className="text-center">
                        <h1 className="font-serif text-2xl font-semibold text-stone-800 mb-4">Something went wrong</h1>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const handleProfileUpdate = (e: React.FormEvent) => {
        try {
            e.preventDefault();
            updateProfile(formData);
            toast({
                title: "Profile updated",
                description: "Your profile has been successfully updated.",
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleLogout = () => {
        logout();
        router.push("/");
        toast({
            title: "Logged out",
            description: "You have been successfully logged out.",
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-stone-50">
            <Header />

            <main className="flex-1 py-8 lg:px-20 px-5">
                <div className="">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="font-serif text-3xl font-semibold text-stone-800 mb-2">My Account</h1>
                        <p className="text-stone-500">Manage your profile, orders, and preferences</p>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl border border-stone-200 p-6">
                                {/* User Info */}
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stone-100">
                                    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <span className="text-emerald-700 text-xl font-semibold">{user?.name?.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-stone-800">{user?.name}</p>
                                        <p className="text-sm text-stone-500">{user?.email}</p>
                                    </div>
                                </div>

                                {/* Navigation */}
                                <nav className="space-y-1">
                                    <button
                                        onClick={() => setActiveTab("orders")}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                                            activeTab === "orders" ? "bg-emerald-50 text-emerald-700" : "hover:bg-stone-50 text-stone-600"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Package className="h-5 w-5" />
                                            <span>My Orders</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("profile")}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                                            activeTab === "profile" ? "bg-emerald-50 text-emerald-700" : "hover:bg-stone-50 text-stone-600"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <User className="h-5 w-5" />
                                            <span>Profile Info</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("addresses")}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                                            activeTab === "addresses" ? "bg-emerald-50 text-emerald-700" : "hover:bg-stone-50 text-stone-600"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <MapPin className="h-5 w-5" />
                                            <span>Addresses</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </nav>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {/* Orders Tab */}
                            {activeTab === "orders" && (
                                <div>
                                    <h2 className="font-serif text-xl font-semibold text-stone-800 mb-6">My Orders</h2>
                                    {orders.length === 0 ? (
                                        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
                                            <Package className="h-12 w-12 text-stone-300 mx-auto mb-4" />
                                            <p className="text-stone-500 mb-4">You haven't placed any orders yet</p>
                                            <Link href="/products">
                                                <Button className="bg-emerald-700 hover:bg-emerald-800">Start Shopping</Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <OrderCard key={order.id} order={order} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Profile Tab */}
                            {activeTab === "profile" && (
                                <div>
                                    <h2 className="font-serif text-xl font-semibold text-stone-800 mb-6">Profile Information</h2>
                                    <div className="bg-white rounded-xl border border-stone-200 p-6">
                                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-stone-700">Full Name</label>
                                                    <Input
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="h-12 rounded-xl border-stone-300"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-stone-700">Email Address</label>
                                                    <Input
                                                        type="email"
                                                        value={formData.email}
                                                        readOnly
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        className="h-12 rounded-xl border-stone-300"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-stone-700">Phone Number</label>
                                                    <Input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="h-12 rounded-xl border-stone-300"
                                                        placeholder="+1 234 567 8900"
                                                    />
                                                </div>
                                            </div>
                                            <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800 rounded-xl h-12 px-8">
                                                Save Changes
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Addresses Tab */}
                            {activeTab === "addresses" && (
                                <div>
                                    <h2 className="font-serif text-xl font-semibold text-stone-800 mb-6">Saved Addresses</h2>
                                    <div className="bg-white rounded-xl border border-stone-200 p-6">
                                        <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center">
                                            <MapPin className="h-10 w-10 text-stone-300 mx-auto mb-4" />
                                            <p className="text-stone-500 mb-4">No addresses saved yet</p>
                                            <Button variant="outline" className="rounded-xl">
                                                Add New Address
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Profile;
