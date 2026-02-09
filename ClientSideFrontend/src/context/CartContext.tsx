"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
export interface Product {
    id: string;
    name: string;
    price: { key: string; value: string; discount?: number };
    images: string[];
    category: string;
    description: string;
    specification: { [key: string]: string };
}

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (product: Product, quantity: number) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex((item) => item.product.id === product.id && item.product.price.key === product.price.key);

            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            }
            return [...prev, { product, quantity }];
        });
    };

    const removeFromCart = (productId: string) => {
        setItems((prev) => prev.filter((item) => item.product.id !== String(productId)));
    };

    useEffect(() => {
        const storedItems = sessionStorage.getItem("cartItems");
        if (storedItems) {
            setItems(JSON.parse(storedItems));
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem("cartItems", JSON.stringify(items));
    }, [items]);

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setItems((prev) => prev.map((item) => (item.product.id === String(productId) ? { ...item, quantity } : item)));
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = items.reduce((sum, item) => sum + parseInt(item.product.price.value) * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                subtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
