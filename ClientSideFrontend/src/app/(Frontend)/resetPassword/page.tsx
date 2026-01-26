"use client";

import { supabase } from "@/lib/supabaseClient";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export default function ResetPassword() {
    const email = useSearchParams().get("email") || "";
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({ resolver: zodResolver(resetPasswordSchema) });

    const handlePasswordReset = async (formData: {
        newPassword: string;
        confirmPassword: string;
    }) => {
        setIsSubmitting(true);

        const { newPassword, confirmPassword } = formData;

        if (newPassword !== confirmPassword) {
            setError("confirmPassword", { message: "Passwords do not match" });
            setIsSubmitting(false);
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            alert(error.message);
        } else {
            alert("Password reset successful. Please sign in.");
            router.push("/Login");
        }

        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-stone-50">
            <Header />

            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <CheckCircle className="h-7 w-7 text-emerald-700" />
                                </div>
                            </div>
                            <h1 className="font-serif text-3xl font-semibold text-stone-800 mb-2">
                                Reset Password
                            </h1>
                            <p className="text-stone-500 text-sm">
                                Create a new password for{" "}
                                <span className="font-medium text-stone-700">
                                    {email}
                                </span>
                            </p>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit(handlePasswordReset)}
                            className="space-y-5"
                        >
                            {/* New Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-stone-700">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                    <Input
                                        type="password"
                                        placeholder="Enter new password"
                                        {...register("newPassword")}
                                        className="pl-10 h-12 rounded-xl border-stone-300 focus:border-emerald-700 focus:ring-emerald-700"
                                    />
                                </div>
                                {errors.newPassword && (
                                    <p className="text-xs text-red-600">
                                        {errors.newPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-stone-700">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                    <Input
                                        type="password"
                                        placeholder="Confirm new password"
                                        {...register("confirmPassword")}
                                        className="pl-10 h-12 rounded-xl border-stone-300 focus:border-emerald-700 focus:ring-emerald-700"
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-600">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
                            >
                                {isSubmitting ? "Resetting..." : "Reset Password"}
                            </Button>

                            {/* Back */}
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="w-full text-sm text-stone-500 hover:text-stone-700 transition-colors"
                            >
                                Back
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
