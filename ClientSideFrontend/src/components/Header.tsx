"use client";

import { ShoppingBag, Menu, X, User, ChevronDown, Package, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";

const Header = () => {
    const { totalItems } = useCart();
    const { user, isAuthenticated, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-stone-50/95 backdrop-blur border-b border-stone-200">
            <div className="flex h-16 items-center justify-between lg:px-20 px-5">
                {/* Logo */}
                <Link href="/" className="font-serif text-2xl font-semibold text-stone-800">
                    <img src="/logo3.png" alt="" className="h-15"/>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link className="nav-link hover:scale-112 duration-150 hover:border-b border-0 hover:text-emerald-700" href="/">
                        Home
                    </Link>
                    <Link className="nav-link hover:scale-112 duration-150 hover:border-b border-0 hover:text-emerald-700"  href="/products">
                        All Products
                    </Link>
                    <Link className="nav-link hover:scale-112 duration-150 hover:border-b border-0 hover:text-emerald-700"  href="/About">
                        About
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Auth (Desktop) */}
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="hidden hover:bg-transparent cursor-pointer sm:flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <span className="text-emerald-700 text-sm font-semibold">{user?.name?.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-gray-100 border-gray-300 shadow-md">
                                <DropdownMenuItem asChild className="hover:bg-gray-200 cursor-pointer duration-150">
                                    <Link href="/Profile" className="flex gap-2">
                                        <User className="h-4 w-4" /> Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="hover:bg-gray-200 cursor-pointer duration-150">
                                    <Link href="/Profile" className="flex gap-2">
                                        <Package className="h-4 w-4" /> Orders
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="text-red-600 hover:bg-red-200 cursor-pointer duration-150">
                                    <LogOut className="h-4 w-4" /> Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/Login" className="hidden sm:block">
                            <Button variant="ghost" size="icon">
                                <User />
                            </Button>
                        </Link>
                    )}

                    {/* Cart */}
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative hover:bg-emerald-100 cursor-pointer">
                            <ShoppingBag />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-700 text-[10px] text-white flex items-center justify-center">
                                    {totalItems > 9 ? "9+" : totalItems}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {/* Mobile Menu Button */}
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-stone-200 bg-stone-50 px-5 py-4 space-y-4">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="mobile-link">
                            Home
                        </Link>
                        <Link href="/products" className="mobile-link">
                            All Products
                        </Link>
                        <Link href="/About" className="mobile-link">
                            About
                        </Link>
                    </div>

                    <div className="border-t border-stone-200 pt-4">
                        {isAuthenticated ? (
                            <div className="flex flex-col gap-4">
                                <Link href="/Profile" className="mobile-link">
                                    My Profile
                                </Link>
                                <Link href="/Profile" className="mobile-link">
                                    My Orders
                                </Link>
                                <button onClick={logout} className="w-full text-left text-sm font-medium text-red-600">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link href="/Login" className="mobile-link">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
