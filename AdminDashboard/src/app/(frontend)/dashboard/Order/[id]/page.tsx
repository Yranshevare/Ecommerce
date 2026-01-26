"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Loader2, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/* ---------- Schema Types ---------- */

type Status = "PENDING" | "ACCEPTED" | "REJECTED";
type PaymentMethod = "COD" | "ONLINE";

interface ProductItem {
    productId: string;
    quantity: number;
    price: string;
    product: {
        name: string;
        images: string[];
    };
}

interface Order {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pin: string;
    paymentMethod: PaymentMethod;
    totalPrice: string;
    products: ProductItem[];
    status: Status;
    createdAt: string;
}

/* ---------- Component ---------- */

export default function OrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, []);

    const fetchOrder = async () => {
        try {
            const res = await axios.get(`/api/order/getOne?id=${id}`);
            console.log(res.data.data);
            setOrder(res.data.data);
        } catch {
            router.push("/dashboard/Order");
        } finally {
            setLoading(false);
        }
    };

    const confirmOrder = async () => {
        if (!order) return;

        try {
            setActionLoading(true);
            await axios.put(`/api/order/confirm?id=${order.id}`);
            setOrder({ ...order, status: "ACCEPTED" });
        } finally {
            setActionLoading(false);
        }
    };

    const deleteOrder = async () => {
        if (!order) return;

        try {
            setActionLoading(true);
            await axios.delete(`/api/order/delete?id=${order.id}`);
            router.push("/dashboard/orders");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin mr-2" /> Loading order...
            </div>
        );
    }

    if (!order) return null;

    let total = 0;

    return (
        <Card className="max-w-5xl mx-auto">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    Order #{order.id.slice(-6)}
                    <Badge className={order.status === "PENDING" ? "bg-yellow-500" : order.status === "ACCEPTED" ? "bg-green-600" : "bg-red-600"}>
                        {order.status}
                    </Badge>
                </CardTitle>
                <CardDescription>Placed on {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Customer Info */}
                {/* <div>
                    <h3 className="font-semibold mb-2">Customer</h3>
                    <p>
                        <strong className="mr-1">Name: </strong> {order.fullName}
                    </p>
                    <p>
                        <strong className="mr-1">Email: </strong> {order.email}
                    </p>
                    <p>
                        <strong className="mr-1">Phone:</strong> {order.phone}
                    </p>
                </div> */}
                <TableBody>
                    <TableRow className="hover:bg-transparent">
                        <TableCell className="font-medium">Name</TableCell>
                        <TableCell>{order.fullName}</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                        <TableCell className="font-medium">Email</TableCell>
                        <TableCell>{order.email}</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                        <TableCell className="font-medium">Phone</TableCell>
                        <TableCell>{order.phone}</TableCell>
                    </TableRow>
                </TableBody>

                <Separator />

                {/* Address */}
                <div>
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <p>
                        {order.address}, {order.city}, {order.state} - {order.pin}
                    </p>
                </div>

                <Separator />

                {/* Order Meta */}
                <div className="flex gap-8">
                    <p>
                        <strong>Payment:</strong> {order.paymentMethod}
                    </p>
                    <p>
                        <strong>Total:</strong> ₹{order.totalPrice}
                    </p>
                </div>

                <Separator />

                {/* Products */}
                <div>
                    <h3 className="font-semibold mb-3">Products ({order.products.length})</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product </TableHead>
                                <TableHead className="text-center">Qty</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.products.map(
                                (item) => (
                                    (total += item.quantity),
                                    (
                                        <TableRow
                                            key={item.productId}
                                            className="cursor-pointer"
                                            onClick={() => router.push(`/dashboard/products/${item.productId}`)}
                                        >
                                            <TableCell>
                                                <div className="flex gap-2 items-center">
                                                    <img
                                                        src={item.product.images[0]}
                                                        alt={item.product.name}
                                                        width={50}
                                                        height={50}
                                                        className="mr-4 rounded-lg"
                                                    />
                                                    <p>{item.product.name}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">{item.quantity ?? "-"}</TableCell>
                                            <TableCell className="text-right">₹{item.price}</TableCell>
                                        </TableRow>
                                    )
                                )
                            )}
                            <div className="h-5"></div>
                            <TableRow >
                                <TableCell  className="text-right flex ">
                                    <strong>Total:</strong>
                                </TableCell>
                                <TableCell  className="text-center "><b>{total}</b></TableCell>
                                <TableCell  className="text-right  ">
                                    <b>₹{order.totalPrice}</b>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <Button variant="outline" className="text-red-600" disabled={actionLoading} onClick={deleteOrder}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Order
                    </Button>

                    {order.status === "PENDING" && (
                        <Button disabled={actionLoading} onClick={confirmOrder} className="bg-blue-600 hover:bg-blue-700">
                            Confirm Order
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
