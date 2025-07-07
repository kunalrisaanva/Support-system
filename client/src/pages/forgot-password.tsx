import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { HelpCircle, ArrowLeft } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordData) => {
    console.log("Forgot password data:", data);
    // Handle forgot password logic here
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
            Forgot Password
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Forgot Password Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Reset Password</CardTitle>
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

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login">
                <a className="inline-flex items-center text-sm text-primary hover:text-primary/80">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Information Box */}
        <div className="text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Need Help?
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-200">
              If you're having trouble accessing your account, please contact our support team at support@supporthub.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}