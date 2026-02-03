"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BarChart3, BellDot, Factory, Home, LogOut, Menu, Package, Settings, Tag, User } from "lucide-react";
import { cn } from "@/lib/utils";
const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Products", href: "/dashboard/products", icon: Package },
    { name: "Categories", href: "/dashboard/categories", icon: Tag },
    { name: "Order", href: "/dashboard/Order", icon: BellDot },
    { name: "Users", href: "/dashboard/User", icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        window.location.href = "/";
    };

    const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
        <div className="flex h-full flex-col">
            <div className="flex h-16 shrink-0 items-center px-6 border-b">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Factory className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">Factory Admin</span>
                </div>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => mobile && setSidebarOpen(false)}
                            className={cn(
                                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon
                                className={cn("mr-3 h-5 w-5 flex-shrink-0", isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-500")}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t p-4">
                <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900" onClick={handleLogout}>
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r">
                <Sidebar />
            </div>

            {/* Mobile Sidebar */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="left" className="p-0 w-64">
                    <Sidebar mobile />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className="flex-1 lg:pl-64">
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="sm" className="lg:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Open sidebar</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64">
                            <Sidebar mobile />
                        </SheetContent>
                    </Sheet>

                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <h1 className="text-lg font-semibold text-gray-900">
                                {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
                            </h1>
                        </div>
                    </div>
                </div>

                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
