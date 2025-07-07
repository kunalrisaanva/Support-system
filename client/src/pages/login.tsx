import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { HelpCircle, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
});

type LoginData = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginData) => {
    console.log("Login data:", data);
    // Handle login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to SupportHub
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  className="mt-2"
                  placeholder="Enter your email"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    placeholder="Enter your password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    id="rememberMe"
                    checked={form.watch("rememberMe")}
                    onCheckedChange={(checked) => 
                      form.setValue("rememberMe", checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor="rememberMe" 
                    className="ml-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    Remember me
                  </Label>
                </div>
                <Link href="/forgot-password">
                  <a className="text-sm text-primary hover:text-primary/80">
                    Forgot your password?
                  </a>
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link href="/register">
                  <a className="text-primary hover:text-primary/80 font-medium">
                    Sign up
                  </a>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Information */}
        <div className="text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Demo Credentials
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-200">
              Email: sarah.johnson@company.com<br />
              Password: password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}