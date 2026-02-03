"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Trash2, DollarSign, Calendar, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type productType = {
    id: string;
    name: string;
    description: string;
    category: string;
    price: { key: string; value: string; discount?: number }[];
    createdAt: string;
    updatedAt: string;
    images: string[];
    specification: {
        [key: string]: string;
    };
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [product, setProduct] = useState<productType | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { data, isLoading, isSuccess } = useQuery({
        queryKey: ["product"],
        queryFn: async () => {
            const { id } = await params;
            const res = await axios.get(`/api/product/getOne?id=${id}`);
            console.log(res.data.data);
            return res.data.data.products;
        },
    });

    useEffect(() => {
        if (isSuccess) {
            if (data) {
                setProduct(data);
            }
        }
    }, [data]);

    const deleteProduct = useCallback(async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        setDeleteLoading(true);
        try {
            const res = await axios.delete(`/api/product/remove?id=${id}`);
            console.log(res.data);
            if (res.status == 200) {
                window.location.href = "/dashboard/products";
            }
        } catch (err) {
            console.error("Failed to delete product", err);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="text-center flex items-center justify-center w-full h-[80vh]">
                <Loader2 className="animate-spin mr-5" />
                Loading...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-10 text-gray-600">
                Product not found.{" "}
                <Link href="/dashboard/products" className="text-blue-600 hover:underline">
                    Go back
                </Link>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-10 text-gray-600">
                Product not found.{" "}
                <Link href="/dashboard/products" className="text-blue-600 hover:underline">
                    Go back
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col items-start ">
                    <Link href="/dashboard/products" className="opacity-50 hover:opacity-100 duration-300 hover:scale-105">
                        <Button variant="ghost" size="sm" className="cursor-pointer">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Products
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        disabled={deleteLoading}
                        onClick={() => (window.location.href = "/dashboard/products/edit/" + product.id)}
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Product
                    </Button>
                    <Button
                        variant="outline"
                        disabled={deleteLoading}
                        onClick={() => deleteProduct(product.id)}
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent cursor-pointer"
                    >
                        {deleteLoading ? (
                            <Loader2 className="animate-spin  h-4 w-4" />
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Product Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Images</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Main Image */}
                                <div className="aspect-square w-full max-w-md mx-auto">
                                    <img
                                        src={product.images[selectedImage] || "/placeholder.svg"}
                                        alt={`${product.name} - Image ${selectedImage + 1}`}
                                        className="w-full h-full object-cover rounded-lg border"
                                    />
                                </div>

                                {/* Thumbnail Images */}
                                {product.images.length > 1 && (
                                    <div className="flex gap-2 justify-center flex-wrap">
                                        {product.images.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImage(index)}
                                                className={`w-16 h-16 rounded-md border-2 overflow-hidden transition-all ${
                                                    selectedImage === index
                                                        ? "border-blue-500 ring-2 ring-blue-200"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            >
                                                <img
                                                    src={image || "/placeholder.svg"}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Product Dates */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Category</span>
                                <span className="text-sm text-gray-900">{product.category}</span>
                            </div>

                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-600">Created</span>
                                </div>
                                <span className="text-sm text-gray-900">{new Date(product.createdAt).toLocaleDateString()}</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Edit className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-600">Last Updated</span>
                                </div>
                                <span className="text-sm text-gray-900">{new Date(product.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/*pricing and discount  */}

                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Discount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                {product.price.map((priceObj) => (
                                    <TableRow key={priceObj.key} className="">
                                        <TableCell className="text-sm font-medium text-gray-600">{priceObj.key}</TableCell>
                                        <TableCell className="text-sm text-gray-900">{priceObj.value} Rs</TableCell>
                                        <TableCell className="text-sm text-gray-900">{priceObj.discount || 0} %</TableCell>
                                    </TableRow>
                                ))}
                            </Table>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Specifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-5">
                                {Object.entries(product.specification).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="font-medium text-gray-900">{key}:</span>
                                        <span className="text-gray-700">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                disabled={deleteLoading}
                                onClick={() => (window.location.href = "/dashboard/products/edit/" + product.id)}
                                className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700"
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Product
                            </Button>
                            <Button
                                variant="outline"
                                disabled={deleteLoading}
                                onClick={() => (window.location.href = "/dashboard/products/")}
                                className="w-full cursor-pointer bg-transparent"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View in Catalog
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => deleteProduct(product.id)}
                                className="w-full text-red-600 cursor-pointer hover:text-red-700 bg-transparent"
                            >
                                {deleteLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Product
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
