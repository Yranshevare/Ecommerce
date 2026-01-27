"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { format } from "date-fns";
import { BellRing, Loader2, Search } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

/* ---------- Schema-based Types ---------- */

interface ProductItem {
    productId: string;
    quantity?: number;
    price: string;
}

type OrderStatus = "PENDING" | "ACCEPTED" | "REJECTED";
type PaymentMethod = "COD" | "ONLINE";

interface Order {
    id: string;
    userId: string;
    email: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pin: string;
    paymentMethod: PaymentMethod;
    totalPrice: string;
    products: ProductItem[];
    status: OrderStatus;
    createdAt: string;
}

/* ---------- Component ---------- */

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get("/api/order/get");
            setOrders(res.data.data);
        } catch (err) {
            console.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter((order) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            order.fullName.toLowerCase().includes(search) ||
            order.email.toLowerCase().includes(search) ||
            order.phone.includes(search) ||
            order.address.toLowerCase().includes(search) ||
            order.id.toLowerCase().includes(search);

        const matchesStatus = statusFilter === "All" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <Loader2 className="animate-spin mr-3" />
                Loading orders...
            </div>
        );
    }

    return (
        <div className="space-y-6 px-4 py-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <BellRing className="h-8 w-8 text-blue-600" />
                <div>
                    <h2 className="text-2xl font-bold">Orders</h2>
                    <p className="text-gray-600">Manage customer orders</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name, email, phone, address, or order ID"
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Order status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="ACCEPTED">Accepted</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Click an order to view full details</CardDescription>
                </CardHeader>

                <CardContent>
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No orders found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredOrders.map((order) => (
                                        <TableRow key={order.id} className="hover:bg-blue-50 cursor-pointer " onClick={()=> router.push(`/dashboard/Order/${order.id}`) }>
                                            <TableCell>
                                                <Link href={`/dashboard/Order/${order.id}`}>#{order.id.slice(-6)}</Link>
                                            </TableCell>

                                            <TableCell>
                                                <p className="font-medium">{order.fullName}</p>
                                                <p className="text-xs text-gray-500">{order.email}</p>
                                            </TableCell>

                                            <TableCell>{order.paymentMethod}</TableCell>

                                            <TableCell>₹{order.totalPrice}</TableCell>

                                            <TableCell>{format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")}</TableCell>

                                            <TableCell>
                                                <Badge
                                                    className={
                                                        order.status === "PENDING"
                                                            ? "bg-yellow-500"
                                                            : order.status === "ACCEPTED"
                                                              ? "bg-green-500"
                                                              : "bg-red-500"
                                                    }
                                                >
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
