"use client";

import { supabase } from "@/lib/supabaseClient";
import { Phone } from "lucide-react";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        (async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            console.log("session", session);
            if (session) {
                const user: User = {
                    id: session.user.id,
                    name: session.user.user_metadata.full_name || session.user.user_metadata.name,
                    email: session.user.user_metadata.email,
                    avatar: session.user.user_metadata.avatar_url,
                    phone: session.user.user_metadata.phone || "",
                };
                if (user) {
                    setUser(user);
                }
            }
        })();
    }, []);

    // TODO: Replace with your backend API call
    const login = async (email: string, password: string): Promise<boolean> => {
        // Mock login - replace with actual API call
        // Example: const response = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

        // Simulate API delay
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) return false;
        console.log(data);
        // Mock successful login
        if (data.user) {
            const user = {
                id: data.user.id,
                name: data.user.user_metadata.full_name || data.user.user_metadata.name,
                email: data.user.user_metadata.email,
            };
            setUser(user);
            return true;
        }
        return false;
    };

    // // TODO: Replace with your backend API call
    // const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    //     // Mock signup - replace with actual API call
    //     // Example: const response = await fetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });

    //     // Simulate API delay
    //     await new Promise((resolve) => setTimeout(resolve, 500));

    //     // Mock successful signup
    //     if (name && email && password) {
    //         setUser({
    //             id: "1",
    //             name: name,
    //             email: email,
    //         });
    //         return true;
    //     }
    //     return false;
    // };

    const logout = async () => {
        // TODO: Call your backend logout endpoint if needed
        // Example: await fetch('/api/auth/logout', { method: 'POST' });
        const { error } = await supabase.auth.signOut({ scope: "local" });

        if (error) {
            console.error("Logout error:", error.message);
        } else {
            setUser(null);
        }
    };

    const updateProfile = async (item: Partial<User>) => {
        // TODO: Replace with your backend API call
        // Example: await fetch('/api/user/profile', { method: 'PUT', body: JSON.stringify(data) });
        try {
            console.log(item);
            const { data, error } = await supabase.auth.updateUser({
                data: {
                    phone: item.phone,
                    full_name: item.name,
                },
            });
            console.log(data);
            if (user && item && !error) {
                setUser({ ...user, ...item });
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    return <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateProfile }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
