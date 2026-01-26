"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Trash2, Package, Calendar, Eye, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect, useCallback } from "react";
import AddProducts from "@/components/AddProducts";
import React from "react";

type Category = {
    id: string;
    name: string;
    description: string;
    productCount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    product: any;
};

interface ProductPageProps {
    params: Promise<{ id: string }>; // params is a Promise
}

export default function CategoryDetailPage({ params }: ProductPageProps) {
    const { id } = React.use(params);
    const categoryId = id;
    const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
    const [category, setCategory] = useState<Category>();
    const [productsInCategory, setProductsInCategory] = useState<any[]>([]);
    const [otherProducts, setOtherProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = async () => {
        try {
            console.log(categoryId);
            const res = await axios.get(`/api/Category/getOne?id=${categoryId}`);
            console.log(res.data.data);
            setCategory(res.data.data.category);
            setProductsInCategory(res.data.data.category.product);
            setOtherProducts(res.data.data.otherProducts);
        } catch (error) {
            console.error("Error fetching category data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [params]);

    const handleDeleteCategory = useCallback(
        async (categoryId: string) => {
            if (!confirm("Are you sure you want to delete this category?")) return;
            setIsDeleting(true);
            try {
                const res = await axios.delete(`/api/Category/delete?id=${categoryId}`);
                console.log(res.data);
                if (res.status === 200) {
                    window.location.href = `/dashboard/categories/`;
                    // refresh()
                }
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        },
        [categoryId]
    );

    if (isLoading) {
        return (
            <div className="text-center flex justify-center py-10 text-gray-600">
                <Loader2 className="animate-spin" />
                loading....
            </div>
        );
    }

    if (!category) {
        return (
            <div className="text-center py-10 text-gray-600">
                Category not found.{" "}
                <Link href="/dashboard/categories" className="text-blue-600 hover:underline">
                    Go back to Categories
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col items-start gap-4">
                    <Link href="/dashboard/categories">
                        <Button variant="ghost" size="sm" disabled={isDeleting} onClick={() => (window.location.href = `/dashboard/categories/`)}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Categories
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
                        <p className="text-gray-600">{category.product.length} products</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={isDeleting}
                        onClick={() => (window.location.href = `/dashboard/categories/edit/${category.id}`)}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Category
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category?.id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-700 bg-transparent"
                    >
                        {isDeleting ? (
                            <Loader2 className=" animate-spin" />
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Category
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Category Information */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Category Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="font-medium text-gray-900">Description</h3>
                                <p className="text-gray-700 leading-relaxed">{category.description}</p>
                            </div>

                            <Separator />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-600">Created</span>
                                    </div>
                                    <span className="text-sm text-gray-900">{new Date(category.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Edit className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-600">Last Updated</span>
                                    </div>
                                    <span className="text-sm text-gray-900">{new Date(category.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products in this Category */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>
                                Products in "{category.name}" ({productsInCategory.length})
                            </CardTitle>
                            <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" disabled={isDeleting} className="bg-blue-600 hover:bg-blue-700">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Product
                                    </Button>
                                </DialogTrigger>

                                <AddProducts
                                    category={category}
                                    otherProducts={otherProducts}
                                    setIsAddProductDialogOpen={setIsAddProductDialogOpen}
                                    fetchData={fetchData}
                                />
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            {productsInCategory.length > 0 ? (
                                <div className="space-y-4">
                                    {productsInCategory.map((product) => (
                                        <div
                                            key={product.id}
                                            className={`${isDeleting ? "pointer-events-none opacity-50" : ""} flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors`}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={product.images[0] || "/placeholder.svg"}
                                                    alt={product.name}
                                                    className="w-10 h-10 rounded-md object-cover"
                                                />
                                                <div>
                                                    <Link href={`/dashboard/products/${product.id}`}>
                                                        <h4 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                                                            {product.name}
                                                        </h4>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="text-right">
                                                    <p className="font-medium text-gray-900">Rs {product.price}</p>
                                                </div>
                                                <Link href={`/dashboard/products/${product.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No products found in this category.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Quick Actions */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                disabled={isDeleting}
                                onClick={() => (window.location.href = `/dashboard/categories/edit/${category.id}`)}
                                className="w-full bg-blue-600 hover:bg-blue-700 mb-3 cursor-pointer"
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Category
                            </Button>

                            <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" disabled={isDeleting} className="w-full bg-transparent cursor-pointer">
                                        <Package className="mr-2 h-4 w-4" />
                                        Add Product
                                    </Button>
                                </DialogTrigger>
                                <AddProducts
                                    category={category}
                                    otherProducts={otherProducts}
                                    setIsAddProductDialogOpen={setIsAddProductDialogOpen}
                                    fetchData={fetchData}
                                />
                            </Dialog>

                            <Button
                                variant="outline"
                                className="w-full text-red-600 hover:text-red-700 bg-transparent cursor-pointer"
                                onClick={() => handleDeleteCategory(category?.id)}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <Loader2 className=" animate-spin" />
                                ) : (
                                    <>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Category
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
