"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, Plus, Upload, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function NewProductPage() {
    const searchParams = useSearchParams();
    const preselectedCategoryId = searchParams.get("categoryId");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        discount: "",
    });
    const [images, setImages] = useState<Array<{ file: File; preview: string; name: string; size: number }>>([]);
    const [specifications, setSpecifications] = useState([{ key: "", value: "" }]);
    const [Saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get("/api/Category/getName");
            console.log(response.data.data);
            setCategories(response.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    }, []);

    useEffect(() => {
        if (preselectedCategoryId) {
            const categoryName: any = categories.find((cat: any) => cat.id === preselectedCategoryId);
            if (categoryName && formData.category !== categoryName.name) {
                // console.log(categoryName);
                setFormData((prev) => ({ ...prev, category: categoryName.name }));
            }
        }
    }, [categories, formData]);

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages = Array.from(files).map((file) => ({
                file,
                preview: URL.createObjectURL(file),
                name: file.name,
                size: file.size,
            }));
            setImages((prev) => [...prev, ...newImages]);
        }
        e.target.value = "";
    };

    const removeImage = (index: number) => {
        setImages((prev) => {
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        // Filter out empty specifications
        const spec: { [key: string]: string } = {};
        specifications.forEach((specification) => {
            if (specification.key && specification.value) {
                spec[specification.key] = specification.value;
            }
        });

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("discount", formData.discount);
        formDataToSend.append("otherSpecification", JSON.stringify(spec));
        formDataToSend.append("specification", JSON.stringify(spec));

        // Append all images
        images.forEach((img: any, index: number) => {
            formDataToSend.append("images", img.file);
        });

        try {
            const res = await axios.post("/api/product/add", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(res.data);
            if (res.status === 200) {
                window.location.href = "/dashboard/products";
                setSaving(false);
            }
        } catch (error) {
            console.log(error);
        }

        // window.location.href = "/dashboard/products";
    };

    return (
        <div className={`${Saving ? "opacity-50 pointer-none:" : ""} space-y-6`}>
            {/* Header */}
            <div className="flex flex-col items-start ">
                <Link href="/dashboard/products" className="opacity-50 hover:opacity-100 duration-300 hover:scale-105">
                    <Button variant="ghost" size="sm" className="cursor-pointer">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Products
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                    <p className="text-gray-600">Create a new product in your catalog</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Information */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Product Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            placeholder="Enter product name"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        placeholder="Enter product description"
                                        rows={4}
                                    />
                                </div>
                                <div className="space-y-2 w-full">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.name}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Specifications */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Specifications</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {specifications.map((spec, index) => (
                                    <div key={index} className="grid gap-4 sm:grid-cols-2">
                                        <Input
                                            onChange={(e) => {
                                                const newSpecs = [...specifications];
                                                newSpecs[index].key = e.target.value;
                                                setSpecifications(newSpecs);
                                            }}
                                            value={specifications[index].key}
                                            placeholder="key"
                                        />
                                        <Input
                                            onChange={(e) => {
                                                const newSpecs = [...specifications];
                                                newSpecs[index].value = e.target.value;
                                                setSpecifications(newSpecs);
                                            }}
                                            value={specifications[index].value}
                                            placeholder="value"
                                        />
                                    </div>
                                ))}
                                <div className="w-1/4">
                                    <Button
                                        onClick={() => setSpecifications((prev) => [...prev, { key: "", value: "" }])}
                                        type="button"
                                        className="w-full bg-blue-600 hover:bg-blue-700 flex justify-center items-center"
                                    >
                                        <Plus />
                                        <span>Add</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pricing & Inventory */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing & Discount</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price (RS) *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => handleInputChange("price", e.target.value)}
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="minStock">Discount %</Label>
                                        <Input
                                            id="discount"
                                            type="number"
                                            value={formData.discount}
                                            onChange={(e) => handleInputChange("discount", e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Product Images */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Images</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="mt-4">
                                        <Label htmlFor="images" className="cursor-pointer ">
                                            <span className="text-sm font-medium text-blue-600 text-center w-full hover:text-blue-500">
                                                {images.length === 0 ? "Upload product images" : "Add more images"}
                                            </span>
                                            <Input
                                                id="images"
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                            />
                                        </Label>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                                        <p className="text-xs text-gray-400">You can select multiple files at once</p>
                                    </div>
                                </div>

                                {images.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm text-center font-medium text-gray-900">Uploaded Images ({images.length})</h4>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setImages([])}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                Clear All
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                                            {images.map((image, index) => (
                                                <div key={index} className="relative group border rounded-lg p-2 hover:bg-gray-50">
                                                    <div className="flex items-center space-x-3">
                                                        <img
                                                            src={image.preview || "/placeholder.svg"}
                                                            alt={`Product ${index + 1}`}
                                                            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">{image.name}</p>
                                                            <p className="text-xs text-gray-500">{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                                                            {index === 0 && (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                                                    Primary Image
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            {index !== 0 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        const newImages = [...images];
                                                                        const [movedImage] = newImages.splice(index, 1);
                                                                        newImages.unshift(movedImage);
                                                                        setImages(newImages);
                                                                    }}
                                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    title="Set as primary"
                                                                >
                                                                    <span className="text-xs">★</span>
                                                                </Button>
                                                            )}
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeImage(index)}
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                                            💡 Tip: The first image will be used as the primary product image. Click ★ to reorder.
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    <Button disabled={Saving} type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                                        {Saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create product"}
                                    </Button>
                                    <Button
                                        disabled={Saving}
                                        onClick={() => (window.location.href = "/dashboard/products")}
                                        type="button"
                                        variant="outline"
                                        className="w-full bg-transparent"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
