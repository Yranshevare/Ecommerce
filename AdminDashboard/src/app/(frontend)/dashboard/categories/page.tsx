"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Search, Edit, MoreHorizontal, Tag, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import AddCategoryForm from "@/components/addCategoryForm";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const loadCategory = async () => {
        try {
            const category = await axios.get("/api/Category/getAll");
            console.log(category.data.data);
            setCategories(category.data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadCategory();
    }, []);

    const filteredCategories =
        categories &&
        categories?.filter(
            (category: any) =>
                category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

    if (loading)
        return (
            <div className="text-center flex items-center justify-center w-full h-[80vh]">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading...
            </div>
        );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-600">Organize your products into categories</p>
                </div>
                <AddCategoryForm loadCategory={loadCategory} />
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Categories Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCategories.map((category: any) => (
                    <Card key={category.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Tag className="w-4 h-4 text-blue-600" />
                                </div>
                                <Link href={`/dashboard/categories/${category.id}`}>
                                    <CardTitle className="text-lg hover:text-blue-600 cursor-pointer">{category.name}</CardTitle>
                                </Link>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href={`/dashboard/categories/${category.id}`}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/dashboard/categories/${category.id}`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">{category._count.product} products</div>
                            </div>
                            <div className="text-xs text-gray-400 mt-2">Created: {new Date(category.createdAt).toLocaleDateString()}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Categories Table (Alternative view) */}
        </div>
    );
}
