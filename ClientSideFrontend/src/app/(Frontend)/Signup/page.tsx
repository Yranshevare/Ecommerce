"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OAuth from "@/components/OAuth";
import { supabase } from "@/lib/supabaseClient";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signInSchema = z.object({
    name: z.string("please enter your name"),
    email: z.string().email("provide a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
});

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm({ resolver: zodResolver(signInSchema) });

    const handleSignUp = async (formData: { email: string; password: string; name: string; confirmPassword: string }) => {
        const { email, password, name, confirmPassword } = formData;
        if (password !== confirmPassword) {
            setError("confirmPassword", { message: "Password does not match" });
            return;
        }
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                },
            },
        });

        if (error) {
            console.error("Sign up error:", error.message);
            alert(error.message);
            setError("root", { message: "error while signing up" });
        } else {
            console.log("Check email for confirmation:", data);
            // toast({
            //     title: "Complete your registration",
            //     description: "Verification needed, check your email to complete registration",
            // });
            alert("Check your email to confirm!");
        }

        console.log("Google OAuth initiated", formData);
    };

    return (
        <div className="min-h-screen flex flex-col bg-stone-50">
            <Header />

            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="font-serif text-3xl font-semibold text-stone-800 mb-2">Create Account</h1>
                            <p className="text-stone-500">Join Nestora for exclusive home décor</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(handleSignUp)} className="space-y-5">
                            {/* Name */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-stone-700">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        {...register("name")}
                                        className="pl-10 h-12 rounded-xl border-stone-300 focus:border-emerald-700 focus:ring-emerald-700"
                                        required
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>

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
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
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
                                        placeholder="Create a password"
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
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-stone-700">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        {...register("confirmPassword")}
                                        className="pl-10 pr-10 h-12 rounded-xl border-stone-300 focus:border-emerald-700 focus:ring-emerald-700"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                            </div>

                            {/* Terms & Conditions */}
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="terms"
                                    checked={agreeTerms}
                                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                                    className="mt-0.5"
                                />
                                <label htmlFor="terms" className="text-sm text-stone-600 cursor-pointer">
                                    I agree to the{" "}
                                    <Link href="/terms" className="text-emerald-700 hover:text-emerald-800">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="text-emerald-700 hover:text-emerald-800">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Creating account..." : "Create Account"}
                            </Button>
                            {errors.root && <p className="text-red-500 text-xs mt-1">{errors.root.message}</p>}
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-stone-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-stone-500">or sign up with</span>
                            </div>
                        </div>

                        {/* Social Signup */}
                        <OAuth />

                        {/* Login Link */}
                        <p className="text-center text-stone-600 mt-6">
                            Already have an account?{" "}
                            <Link href="/Login" className="text-emerald-700 hover:text-emerald-800 font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Signup;
