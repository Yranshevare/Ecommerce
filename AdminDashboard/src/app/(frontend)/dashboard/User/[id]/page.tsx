"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Order = {
    id: string;
    paymentMethod: string;
    totalPrice: number;
    status: string;
    createdAt: string;
};

type UserDetails = {
    created_at: string;
    lastSignIn: string | null;
    name: string;
    email: string;
    phone: string;
    orders: Order[];
};

export default function UserDetailsPage() {
    const { id } = useParams();

    const router = useRouter();

    const { data, isLoading } = useQuery<UserDetails>({
        queryKey: ["user-details", id],
        queryFn: async () => {
            const res = await axios.get(`/api/User/getOne?id=${id}`);
            return res.data.data;
        },
        enabled: !!id,
    });

    if (isLoading) {
        return <div>Loading user details...</div>;
    }

    if (!data) {
        return <div>User not found</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
                <p className="text-gray-600">View user information and order history</p>
            </div>

            {/* User Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoItem label="Name" value={data.name} />
                    <InfoItem label="Email" value={data.email} />
                    <InfoItem label="Phone" value={data.phone || "—"} />
                    <InfoItem label="Joined At" value={new Date(data.created_at).toLocaleString()} />
                    <InfoItem label="Last Sign In" value={data.lastSignIn ? new Date(data.lastSignIn).toLocaleString() : "Never"} />
                </CardContent>
            </Card>

            {/* Orders */}
            <Card>
                <CardHeader>
                    <CardTitle>Orders ({data.orders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.orders.map((order) => (
                                    <TableRow key={order.id} onClick={()=>router.push(`/dashboard/Order/${order.id}`)}>
                                        <TableCell className="font-mono text-xs">{order.id}</TableCell>
                                        <TableCell>{order.paymentMethod}</TableCell>
                                        <TableCell>{order.totalPrice} RS</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                        </TableCell>
                                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}

                                {data.orders.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-gray-500">
                                            No orders found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

/* ---------- helpers ---------- */

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-medium text-gray-900">{value}</p>
        </div>
    );
}

function getStatusVariant(status: string) {
    switch (status.toLowerCase()) {
        case "completed":
            return "default";
        case "pending":
            return "secondary";
        case "cancelled":
            return "destructive";
        default:
            return "outline";
    }
}
