"use client"

import type React from "react"
import axios from "axios"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Factory, Loader2 } from "lucide-react"
import {useForm} from 'react-hook-form'
import { z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from "next/navigation"

const schema = z.object({
  email: z.string().email("enter a valid email"),
  password: z.string().min(8,  "Password must be at least 8 characters" ),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter();


  const {register, handleSubmit,formState: { errors, isSubmitting }, setError} = useForm<FormData>({resolver: zodResolver(schema)});


  const handleLogin = async(data: {email: string, password: string}) => {
    // console.log(data);
    try {
      const res:any = await axios.get(`/api/auth/login?email=${data.email}&password=${data.password}`)
      console.log(res.data)
      if (res.status === 200) {
        // window.location.href = "/dashboard"
        router.push("/dashboard")
        // localStorage.setItem("token", res.data.token)
      }
    } catch (error:any) {
      console.log(error)
      setError("root", {
        type: "manual",
        message: error.response.data.message  || "Something went wrong please try again",
      })
    }
    
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Factory className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Factory Admin</CardTitle>
            <CardDescription>Sign in to manage your product catalog</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@factory.com"
                {...register("email")}
                required
              />
              <div className="h-2">
                {errors.email && <p className="text-red-500 text-[11px]">{errors.email.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  required
                />
                <div className="h-2">
                  {errors.password && <p className="text-red-500 text-[11px]">{errors.password.message}</p>}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit"  disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer">
              {
                isSubmitting ?
                <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                :
                <span>Sign In</span>
              }
            </Button>
            <div className="h-2 text-center">
              {errors.root && <p className="text-red-500 text-[11px]">{errors.root.message}</p>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}