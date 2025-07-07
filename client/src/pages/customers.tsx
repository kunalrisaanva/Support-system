import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Filter, Mail, Phone, Building, MapPin, Ticket, Calendar } from "lucide-react";

// Sample customer data
const customers = [
  {
    id: "CUST-001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    company: "Tech Solutions Inc.",
    location: "New York, NY",
    status: "active",
    plan: "enterprise",
    ticketsCount: 12,
    lastContact: "2024-01-15T10:30:00Z",
    joinedDate: "2023-06-15T00:00:00Z",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    totalSpent: "$2,400",
  },
  {
    id: "CUST-002",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    phone: "+1 (555) 234-5678",
    company: "Marketing Pro",
    location: "Los Angeles, CA",
    status: "active",
    plan: "professional",
    ticketsCount: 8,
    lastContact: "2024-01-14T16:45:00Z",
    joinedDate: "2023-08-20T00:00:00Z",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c2a9?w=150&h=150&fit=crop&crop=face",
    totalSpent: "$1,200",
  },
  {
    id: "CUST-003",
    name: "Mike Chen",
    email: "mike.chen@startup.io",
    phone: "+1 (555) 345-6789",
    company: "StartupFlow",
    location: "San Francisco, CA",
    status: "inactive",
    plan: "basic",
    ticketsCount: 3,
    lastContact: "2024-01-10T11:20:00Z",
    joinedDate: "2023-11-05T00:00:00Z",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    totalSpent: "$300",
  },
  {
    id: "CUST-004",
    name: "Emma Wilson",
    email: "emma.w@business.com",
    phone: "+1 (555) 456-7890",
    company: "Business Dynamics",
    location: "Chicago, IL",
    status: "active",
    plan: "enterprise",
    ticketsCount: 15,
    lastContact: "2024-01-15T08:15:00Z",
    joinedDate: "2023-04-10T00:00:00Z",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    totalSpent: "$3,600",
  },
  {
    id: "CUST-005",
    name: "Alex Rodriguez",
    email: "alex.r@enterprise.com",
    phone: "+1 (555) 567-8901",
    company: "Enterprise Solutions",
    location: "Miami, FL",
    status: "active",
    plan: "professional",
    ticketsCount: 6,
    lastContact: "2024-01-12T14:30:00Z",
    joinedDate: "2023-09-18T00:00:00Z",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    totalSpent: "$1,800",
  },
  {
    id: "CUST-006",
    name: "Lisa Park",
    email: "lisa.park@digital.co",
    phone: "+1 (555) 678-9012",
    company: "Digital Innovations",
    location: "Seattle, WA",
    status: "trial",
    plan: "trial",
    ticketsCount: 2,
    lastContact: "2024-01-13T09:45:00Z",
    joinedDate: "2024-01-01T00:00:00Z",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    totalSpent: "$0",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "inactive": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    case "trial": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getPlanColor = (plan: string) => {
  switch (plan) {
    case "enterprise": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "professional": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "basic": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    case "trial": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getInitials = (name: string) => {
  return name.split(" ").map(n => n[0]).join("").toUpperCase();
};

export default function Customers() {
  return (
    <div className="flex-1 overflow-auto">
      <Header title="Customers" subtitle="Manage your customer relationships" />
      
      <main className="p-8 max-w-7xl mx-auto">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search customers..."
                className="pl-10 w-64"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {/* Customer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={customer.avatar} alt={customer.name} />
                    <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {customer.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {customer.company}
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                      <Badge className={getPlanColor(customer.plan)}>
                        {customer.plan}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{customer.location}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                      <Ticket className="h-4 w-4" />
                      <span>{customer.ticketsCount} tickets</span>
                    </div>
                    <div className="text-gray-900 dark:text-white font-medium">
                      {customer.totalSpent}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span>Joined {formatDate(customer.joinedDate)}</span>
                    <span>Last contact {formatDate(customer.lastContact)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {customers.length} of {customers.length} customers
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
