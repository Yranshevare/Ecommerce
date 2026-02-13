"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Truck, Clock, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

type product = {
    productId: string;
    quantity: number;
    price: { key: string; value: string; discount?: number };
    product: {
        name: string;
        images: string[];
        specification: { [key: string]: string };
    };
};

type order = {
    id: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    paymentMethod: "COD" | "ONLINE";
    totalPrice: string;
    createdAt: string;
    address: string;
    city: string;
    state: string;
    pin: string;
    phone: string;
    products: product[];
};

const statusConfig = {
    PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
    ACCEPTED: { color: "bg-blue-100 text-blue-800", icon: Truck },
    REJECTED: { color: "bg-red-100 text-red-800", icon: XCircle },
};

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    //   const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<order | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: [`order`],
        queryFn: async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            const token = session?.access_token;
            const id = (await params).id;
            const res = await axios.get(`/api/Order/getOne?token=${token}&id=${id}`);
            setOrder(res.data.data);
            return res.data.data;
        },
    });

    // useEffect(() => {
    //     if (data) {
    //         console.log(data);
    //         setOrder(data);
    //     }
    // }, [data]);

    if(isLoading){
        return <div className="p-10 text-center">Loading...</div>;
    }

    if (!order) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    const StatusIcon = statusConfig[order.status].icon;

    return (
        <div className="min-h-screen bg-stone-50">
            <Header />

            <main className="max-w-5xl mx-auto py-10 px-4 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold">Order Details </h1>
                        <p>Order Id: {order.id}</p>
                        <p className="text-stone-500 text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>

                    <Badge className={`${statusConfig[order.status].color} flex gap-1`}>
                        <StatusIcon className="h-3 w-3" />
                        {order.status}
                    </Badge>
                </div>

                {/* Products */}
                <div className="bg-white rounded-xl border p-6 space-y-4">
                    <h2 className="font-semibold text-lg">Items</h2>

                    {order.products.map((item: product) => (
                        <div key={item.productId} className="flex gap-4 border-b pb-4 last:border-none">
                            <img onClick={()=> router.push(`/products/${item.productId}`)} src={item.product.images[0]} className="w-20 h-20 rounded-lg object-cover" alt={item.product.name} />

                            <div className="flex-1 ">
                                <p className="font-medium">{item.product.name} - {item.price.key}</p>
                                <p className="text-sm text-stone-500">Quantity: {item.quantity}</p>
                                <p className="text-sm text-stone-500">
                                    {Object.entries(item.product.specification)
                                        .map(([key, value]) => `${key}: ${value}`)
                                        .join(" • ")}
                                </p>
                            </div>

                            <p className="font-medium">₹{(item.quantity * Number(item.price.value)).toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Address */}
                    <div className="bg-white rounded-xl border p-6">
                        <h2 className="font-semibold mb-2">Shipping Address</h2>
                        <p className="text-sm text-stone-600 flex flex-col gap-2">
                            <span>Address: {order.address}</span>
                            <span>
                                City: {order.city} - {order.pin}{" "}
                            </span>
                            <span>State: {order.state}</span>
                        </p>
                        <p className="text-sm mt-2">Phone: {order.phone}</p>
                    </div>

                    {/* Payment */}
                    <div className="bg-white rounded-xl border p-6 flex flex-col gap-2">
                        <h2 className="font-semibold mb-2">Payment Summary</h2>
                        <p className="text-sm text-stone-600">Payment Method: {order.paymentMethod}</p>
                        <p className="text-sm text-stone-600">Shipping: free</p>
                        <p className="text-sm text-stone-600">GST: Included</p>
                        <p className="text-lg font-semibold mt-4">Total: ₹{Number(order.totalPrice).toFixed(2)}</p>
                    </div>
                </div>

                <Button variant="outline" onClick={() => router.back()}>
                    Back to Orders
                </Button>
            </main>

            <Footer />
        </div>
    );
}
