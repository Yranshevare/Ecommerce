"use client";

import React, { useState } from "react";
import { Mail } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { server } from "@/lib/constant";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailSubmit = async () => {
        if (!email) return;
        setLoading(true);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${server}/resetPassword?email=${email}`,
        });

        if (error) {
            alert(error.message);
        } else {
            alert("Check your email for the reset link");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-stone-50">
            <Header />

            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="font-serif text-3xl font-semibold text-stone-800 mb-2">
                                Forgot Password
                            </h1>
                            <p className="text-stone-500">
                                We’ll send you a password reset link
                            </p>
                        </div>

                        {/* Email */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-stone-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12 rounded-xl border-stone-300 focus:border-emerald-700 focus:ring-emerald-700"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <Button
                                onClick={handleEmailSubmit}
                                disabled={loading}
                                className="w-full h-12 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </Button>

                            {/* Back */}
                            <button
                                onClick={() => window.history.back()}
                                className="w-full text-sm text-stone-500 hover:text-stone-700 transition-colors"
                            >
                                Back to sign in
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
