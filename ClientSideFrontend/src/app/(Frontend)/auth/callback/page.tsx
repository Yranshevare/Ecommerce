"use client";
import { supabase } from "@/lib/supabaseClient";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function page() {
    const [message, setMessage] = useState<string>("Processing your request...");
    const router = useRouter();

    useEffect(() => {
        (async function () {
            await supabase.auth.onAuthStateChange(async (event, session) => {
                if (event === "PASSWORD_RECOVERY") {
                    setMessage("Redirecting...");
                    router.replace(`/resetPassword?email=${session?.user.email}`);
                    console.log(session?.user.email);
                }
            });
        })();
    }, []);
    return (
        <div className="flex items-center justify-center min-h-screen gap-4"><Loader2 className="animate-spin"/>{message}</div>
    );
}
