import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { HelpCircle, Eye, EyeOff } from "lucide-react";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  role: z.string().min(1, "Please select a role"),
  department: z.string().min(1, "Please select a department"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterData = z.infer<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      department: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = (data: RegisterData) => {
    console.log("Register data:", data);
    // Handle registration logic here
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
            Join SupportHub
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create your account to get started
          </p>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  {...form.register("fullName")}
                  className="mt-2"
                  placeholder="Enter your full name"
                />
                {form.formState.errors.fullName && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.fullName.message}
                  </p>
                )}
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={form.watch("role")}
                    onValueChange={(value) => form.setValue("role", value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support-agent">Support Agent</SelectItem>
                      <SelectItem value="team-lead">Team Lead</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.role && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.role.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={form.watch("department")}
                    onValueChange={(value) => form.setValue("department", value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select dept" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer-support">Customer Support</SelectItem>
                      <SelectItem value="technical-support">Technical Support</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.department && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.department.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    placeholder="Create a password"
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

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...form.register("confirmPassword")}
                    placeholder="Confirm your password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="agreeToTerms"
                  checked={form.watch("agreeToTerms")}
                  onCheckedChange={(checked) => 
                    form.setValue("agreeToTerms", checked as boolean)
                  }
                />
                <Label 
                  htmlFor="agreeToTerms" 
                  className="ml-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:text-primary/80">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:text-primary/80">
                    Privacy Policy
                  </a>
                </Label>
              </div>
              {form.formState.errors.agreeToTerms && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.agreeToTerms.message}
                </p>
              )}

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link href="/login">
                  <a className="text-primary hover:text-primary/80 font-medium">
                    Sign in
                  </a>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}