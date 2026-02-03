"use client";
import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { categories } from "@/data/products";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const PRODUCTS_PER_PAGE = 8;

// const defaultFilters: Filters = {
//     priceRange: [0, 200],
//     materials: [],
//     sizes: [],
//     colors: [],
//     inStock: false,
// };

type SortOption = "newest" | "price-asc" | "price-desc" | "popular";

const Products = () => {
    // const searchParams = useSearchParams();
    const [category, setCategory] = useState<string | undefined>(undefined);
    console.log(category);
    // const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [sortBy, setSortBy] = useState<SortOption>("popular");
    const [currentPage, setCurrentPage] = useState(1);

    const categoryInfo = category ? categories.find((c) => c.slug === category) : null;

    const pageTitle = categoryInfo?.label || "All Products";
    const pageDescription = categoryInfo?.description || "Explore our complete collection of premium home textiles";

    const { data, isLoading } = useQuery({
        queryKey: ["products", category],
        queryFn: async () => {
            const res = await axios.get("/api/Product/getAll");
            const cat = await axios.get("/api/category/getAll");
            const categories = [...cat.data.data, { name: "All Products" }];
            // const categories = await axios.get("/api/category/getAll");
            console.log(res.data);
            return { data: res.data.data, categoryData: categories };
        },
    });

    // const { data: categoryData, isLoading: categoryLoading } = useQuery({
    //     queryKey: ["orders"],
    //     queryFn: async () => {
    //         const res = await axios.get("/api/category/getAll");
    //         console.log(res.data);
    //         const cat = [...res.data.data, { name: "All Products" }];

    //         return cat;
    //     },
    // });

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        if (!data) return [];
        let result = data.data;

        // Filter by category
        if (category) {
            result = result.filter((p: any) => p.category === category);
        }

        // Filter by price range
        // result = result.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

        // Filter by materials
        // if (filters.materials.length > 0) {
        //     result = result.filter((p) => filters.materials.includes(p.material));
        // }

        // // Filter by sizes
        // if (filters.sizes.length > 0) {
        //     result = result.filter((p) => filters.sizes.includes(p.size));
        // }

        // // Filter by colors
        // if (filters.colors.length > 0) {
        //     result = result.filter((p) => filters.colors.includes(p.color));
        // }

        // // Filter by stock
        // if (filters.inStock) {
        //     result = result.filter((p) => p.inStock);
        // }

        // Sort
        switch (sortBy) {
            case "price-asc":
                result = [...result].sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                result = [...result].sort((a, b) => b.price - a.price);
                break;
            case "newest":
                result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            case "popular":
            default:
                result = [...result].sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        }

        return result;
    }, [category, sortBy, data]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

    const handleResetFilters = () => {
        // setFilters(defaultFilters);
        setCurrentPage(1);
    };

    // const handleFiltersChange = (newFilters: Filters) => {
    //     setFilters(newFilters);
    //     setCurrentPage(1);
    // };

    const handleSortChange = (value: SortOption) => {
        setSortBy(value);
        setCurrentPage(1);
    };
    const handleCategoryChange = (value: string) => {
        if (value === "All Products") {
            setCategory(undefined);
        } else {
            setCategory(value);
        }
        setCurrentPage(1);
    };

    const breadcrumbItems = [{ label: "Products", href: "/products" }, { label: pageTitle }];

    if (isLoading) {
        return <ProductsLoading />;
    }
    
    return (
        <div className="min-h-screen bg-stone-50">
            <Header />

            <main className="py-8 lg:px-20 px-5">
                <div className="">
                    {/* Breadcrumb */}
                    <Breadcrumb items={breadcrumbItems} />

                    {/* Page Header */}
                    <div className="mt-6 mb-8">
                        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-stone-800 mb-2">All Products</h1>
                        <p className="text-stone-500">Explore our complete collection of premium home textiles</p>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
                        <div className="flex items-center gap-4">
                            {/* Mobile Filters */}
                            {/* <ProductFilters
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                onReset={handleResetFilters}
                                activeFiltersCount={activeFiltersCount}
                            />
                            <p className="text-sm text-stone-500">
                                {filteredProducts.length} product
                                {filteredProducts.length !== 1 ? "s" : ""}
                            </p> */}
                        </div>

                        <div className="flex gap-4 flex-wrap">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-stone-500 hidden sm:block">Sort by:</span>
                                <Select value={sortBy} onValueChange={handleSortChange}>
                                    <SelectTrigger className="w-[160px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-50">
                                        <SelectItem value="popular">Popular</SelectItem>
                                        <SelectItem value="newest">Newest</SelectItem>
                                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {data?.categoryData && (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-stone-500 hidden sm:block">Category</span>
                                    <Select value={category ? category : "All Products"} onValueChange={handleCategoryChange}>
                                        <SelectTrigger className="w-[160px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-50">
                                            {data.categoryData.map((category: { name: string }, index: number) => (
                                                <SelectItem key={index} value={category.name}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex gap-8">
                        {/* Desktop Filters Sidebar */}
                        {/* <aside className="hidden lg:block w-64 shrink-0">
                            <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-md">
                                <FilterContent
                                    filters={filters}
                                    onFiltersChange={handleFiltersChange}
                                    onReset={handleResetFilters}
                                    activeFiltersCount={activeFiltersCount}
                                />
                            </div>
                        </aside> */}

                        {/* Product Grid */}
                        <div className="flex-1">
                            <ProductGrid products={paginatedProducts} onResetFilters={handleResetFilters} />

                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Products;

const ProductsLoading = () => {
    return (
        <div className="min-h-screen bg-stone-50">
            {/* Header placeholder */}
            <div className="h-20 bg-white shadow-sm" />

            <main className="py-8 lg:px-20 px-5 animate-pulse">
                {/* Breadcrumb */}
                <div className="h-4 w-40 bg-stone-200 rounded mb-6" />

                {/* Page header */}
                <div className="mb-8">
                    <div className="h-10 w-64 bg-stone-200 rounded mb-3" />
                    <div className="h-4 w-96 bg-stone-200 rounded" />
                </div>

                {/* Toolbar */}
                <div className="flex justify-between mb-8 pb-6 border-b border-stone-200">
                    <div className="h-10 w-32 bg-stone-200 rounded" />
                    <div className="flex gap-4">
                        <div className="h-10 w-40 bg-stone-200 rounded" />
                        <div className="h-10 w-40 bg-stone-200 rounded" />
                    </div>
                </div>

                {/* Product Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm p-4">
                            {/* Image */}
                            <div className="h-48 bg-stone-200 rounded-lg mb-4" />

                            {/* Title */}
                            <div className="h-4 bg-stone-200 rounded w-3/4 mb-2" />

                            {/* Price */}
                            <div className="h-4 bg-stone-200 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer placeholder */}
            <div className="h-40 bg-white mt-12" />
        </div>
    );
};
