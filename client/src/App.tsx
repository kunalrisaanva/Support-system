import { Switch, Route, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Sidebar } from "@/components/layout/sidebar";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Tickets from "@/pages/tickets";
import Customers from "@/pages/customers";
import Settings from "@/pages/settings";
import Profile from "@/pages/profile";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgot-password";

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated");
      setIsAuthenticated(authStatus === "true");
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, logout };
}

function AuthenticatedLayout() {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar onLogout={logout} />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/tickets" component={Tickets} />
        <Route path="/customers" component={Customers} />
        <Route path="/settings" component={Settings} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function PublicLayout() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route component={Login} />
    </Switch>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading SupportHub...</p>
        </div>
      </div>
    );
  }

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/forgot-password"];
  const isPublicRoute = publicRoutes.includes(location);

  // If not authenticated and trying to access private route, redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    return <PublicLayout />;
  }

  // If authenticated and trying to access public route, redirect to dashboard
  if (isAuthenticated && isPublicRoute) {
    setLocation("/");
    return null;
  }

  // Render appropriate layout based on authentication
  return isAuthenticated ? <AuthenticatedLayout /> : <PublicLayout />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
