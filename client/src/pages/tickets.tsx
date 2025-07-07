import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Clock, MessageSquare, User, Calendar } from "lucide-react";

// Sample ticket data
const tickets = [
  {
    id: "TK-001",
    title: "Unable to access dashboard",
    customer: "John Smith",
    email: "john.smith@example.com",
    priority: "high",
    status: "open",
    category: "technical",
    createdAt: "2024-01-15T10:30:00Z",
    lastUpdated: "2024-01-15T14:22:00Z",
    description: "Customer reports they cannot log into the dashboard. Getting error message about invalid credentials.",
    messages: 3,
  },
  {
    id: "TK-002",
    title: "Billing inquiry about subscription",
    customer: "Sarah Johnson",
    email: "sarah.j@company.com",
    priority: "medium",
    status: "in-progress",
    category: "billing",
    createdAt: "2024-01-14T16:45:00Z",
    lastUpdated: "2024-01-15T09:15:00Z",
    description: "Customer wants to understand the charges on their monthly subscription.",
    messages: 5,
  },
  {
    id: "TK-003",
    title: "Feature request: Dark mode",
    customer: "Mike Chen",
    email: "mike.chen@startup.io",
    priority: "low",
    status: "resolved",
    category: "feature",
    createdAt: "2024-01-13T11:20:00Z",
    lastUpdated: "2024-01-14T13:40:00Z",
    description: "Customer requesting dark mode support for better user experience.",
    messages: 2,
  },
  {
    id: "TK-004",
    title: "Password reset not working",
    customer: "Emma Wilson",
    email: "emma.w@business.com",
    priority: "high",
    status: "open",
    category: "technical",
    createdAt: "2024-01-15T08:15:00Z",
    lastUpdated: "2024-01-15T08:15:00Z",
    description: "Customer cannot reset password. Reset email is not being received.",
    messages: 1,
  },
  {
    id: "TK-005",
    title: "Data export functionality",
    customer: "Alex Rodriguez",
    email: "alex.r@enterprise.com",
    priority: "medium",
    status: "in-progress",
    category: "feature",
    createdAt: "2024-01-12T14:30:00Z",
    lastUpdated: "2024-01-15T11:20:00Z",
    description: "Customer needs ability to export their data in CSV format.",
    messages: 7,
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "open": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "in-progress": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "resolved": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "closed": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function Tickets() {
  return (
    <div className="flex-1 overflow-auto">
      <Header title="Tickets" subtitle="Manage customer support tickets" />
      
      <main className="p-8 max-w-7xl mx-auto">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tickets..."
                className="pl-10 w-64"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {ticket.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {ticket.id}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {ticket.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{ticket.customer}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(ticket.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{ticket.messages} messages</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex space-x-2">
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      Updated {formatDate(ticket.lastUpdated)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {tickets.length} of {tickets.length} tickets
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
