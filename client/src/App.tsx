import { Switch, Route } from "wouter";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/tickets" component={Tickets} />
      <Route path="/customers" component={Customers} />
      <Route path="/settings" component={Settings} />
      <Route path="/profile" component={Profile} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthenticatedLayout() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Switch>
            <Route path="/login" component={PublicLayout} />
            <Route path="/register" component={PublicLayout} />
            <Route path="/forgot-password" component={PublicLayout} />
            <Route component={AuthenticatedLayout} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
