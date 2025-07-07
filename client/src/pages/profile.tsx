import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ui/theme-provider";
import { apiRequest } from "@/lib/queryClient";
import { Check, Lock, CheckCircle, AlertTriangle, Info, ChevronLeft, ChevronRight } from "lucide-react";

const profileUpdateSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
  language: z.string().min(1, "Language is required"),
  emailNotifications: z.boolean(),
});

const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
type PasswordUpdateData = z.infer<typeof passwordUpdateSchema>;

export default function Profile() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch user data
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/user"],
    enabled: true,
  });

  // Fetch activities
  const { data: activitiesData, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/user/activities", currentPage],
    enabled: true,
  });

  // Profile form
  const profileForm = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      role: user?.role || "support-agent",
      department: user?.department || "customer-support",
      language: user?.language || "en",
      emailNotifications: user?.emailNotifications || true,
    },
  });

  // Password form
  const passwordForm = useForm<PasswordUpdateData>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Profile update mutation
  const profileMutation = useMutation({
    mutationFn: async (data: ProfileUpdateData) => {
      const response = await apiRequest("PATCH", "/api/user", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/activities"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    },
  });

  // Password update mutation
  const passwordMutation = useMutation({
    mutationFn: async (data: PasswordUpdateData) => {
      const response = await apiRequest("PATCH", "/api/user/password", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      passwordForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/user/activities"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update password.",
        variant: "destructive",
      });
    },
  });

  // Update form defaults when user data loads
  useEffect(() => {
    if (user) {
      profileForm.reset({
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        language: user.language,
        emailNotifications: user.emailNotifications,
      });
    }
  }, [user]);

  const onProfileSubmit = (data: ProfileUpdateData) => {
    profileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordUpdateData) => {
    passwordMutation.mutate(data);
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    setTheme(enabled ? "dark" : "light");
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-white" />;
      case "warning":
        return <Lock className="w-5 h-5 text-white" />;
      case "info":
        return <Info className="w-5 h-5 text-white" />;
      default:
        return <Check className="w-5 h-5 text-white" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-green-500";
    }
  };

  const totalPages = Math.ceil((activitiesData?.total || 0) / 10);

  if (userLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <Header title="My Profile" subtitle="Manage your account settings and preferences" />
        <div className="p-8">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64 bg-gray-200 rounded-xl"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <Header title="My Profile" subtitle="Manage your account settings and preferences" />
      
      <main className="p-8 max-w-6xl mx-auto space-y-8">
        {/* Profile Information Section */}
        <Card>
          <CardContent className="p-8">
            <div className="flex items-start space-x-8">
              <div className="flex-shrink-0">
                <div className="relative">
                  <img 
                    src={user?.avatar || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg"} 
                    alt="Profile picture" 
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        {...profileForm.register("fullName")}
                        className="mt-2"
                      />
                      {profileForm.formState.errors.fullName && (
                        <p className="text-sm text-red-500 mt-1">
                          {profileForm.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        {...profileForm.register("email")}
                        className="mt-2"
                      />
                      {profileForm.formState.errors.email && (
                        <p className="text-sm text-red-500 mt-1">
                          {profileForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={profileForm.watch("role")}
                        onValueChange={(value) => profileForm.setValue("role", value)}
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
                    </div>
                    
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={profileForm.watch("department")}
                        onValueChange={(value) => profileForm.setValue("department", value)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer-support">Customer Support</SelectItem>
                          <SelectItem value="technical-support">Technical Support</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={profileMutation.isPending}
                      className="bg-primary hover:bg-blue-600"
                    >
                      {profileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Change Password Section */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...passwordForm.register("currentPassword")}
                    className="mt-2"
                    placeholder="Enter current password"
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...passwordForm.register("newPassword")}
                    className="mt-2"
                    placeholder="Enter new password"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register("confirmPassword")}
                    className="mt-2"
                    placeholder="Confirm new password"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  disabled={passwordMutation.isPending}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {passwordMutation.isPending ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preferences Section */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={handleDarkModeToggle}
                />
              </div>

              {/* Language Selection */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Language</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose your preferred language</p>
                <Select
                  value={profileForm.watch("language")}
                  onValueChange={(value) => profileForm.setValue("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications about ticket updates</p>
                </div>
                <Switch
                  checked={profileForm.watch("emailNotifications")}
                  onCheckedChange={(checked) => profileForm.setValue("emailNotifications", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-start space-x-4 p-4 rounded-lg bg-gray-50">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {activitiesData?.activities?.map((activity: any) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center`}>
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                      {activity.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{activity.description}</p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {activity.createdAt ? format(new Date(activity.createdAt), "PPp") : "Just now"}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                <div className="flex items-center justify-center mt-8 space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
