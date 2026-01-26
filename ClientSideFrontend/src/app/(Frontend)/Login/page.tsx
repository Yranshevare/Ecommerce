"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OAuth from "@/components/OAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabaseClient";

const signInSchema = z.object({
    email: z.string().email("provide a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm({ resolver: zodResolver(signInSchema) });

    const handleSignIn = async (formData: { email: string; password: string }) => {
        const { email, password } = formData;

        const res = await login(email, password);

        if (!res) {
            // console.error("Sign in error:", error.message);
            // alert(error.message);
            setError("root", { message: "error while signing in" });
        } else {
            // console.log("Signed in:", data.user);
            router.push("/");
        }

        // console.log("Google OAuth initiated", formData);
    };

    return (
        <div className="min-h-screen flex flex-col bg-stone-50">
            <Header />

            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="font-serif text-3xl font-semibold text-stone-800 mb-2">Welcome Back</h1>
                            <p className="text-stone-500">Sign in to your account to continue</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(handleSignIn)} className="space-y-5">
                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-stone-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        {...register("email")}
                                        className="pl-10 h-12 rounded-xl border-stone-300 focus:border-emerald-700 focus:ring-emerald-700"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-stone-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        {...register("password")}
                                        className="pl-10 pr-10 h-12 rounded-xl border-stone-300 focus:border-emerald-700 focus:ring-emerald-700"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-end">
                                <Link href="/forgetPassword" className="text-sm text-emerald-700 hover:text-emerald-800 font-medium">
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Signing in..." : "Sign in"}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-stone-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-stone-500">or continue with</span>
                            </div>
                        </div>

                        {/* Social Login */}
                        <OAuth />

                        {/* Sign Up Link */}
                        <p className="text-center text-stone-600 mt-6">
                            Don't have an account?{" "}
                            <Link href="/Signup" className="text-emerald-700 hover:text-emerald-800 font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Login;
