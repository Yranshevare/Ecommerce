"use client";
import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <CartProvider>
                <TooltipProvider>
                    <AuthProvider>
                        <Toaster />
                        <Sonner />
                        <body>
                            <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
                        </body>
                    </AuthProvider>
                </TooltipProvider>
            </CartProvider>
        </html>
    );
}
