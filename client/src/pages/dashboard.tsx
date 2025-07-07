import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Users, 
  Ticket, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingDown,
  ArrowUpRight,
  MessageSquare,
  Calendar
} from "lucide-react";

// Sample data for recent tickets
const recentTickets = [
  {
    id: "TK-001",
    title: "Unable to access dashboard",
    customer: "John Smith",
    priority: "high",
    status: "open",
    time: "10 min ago",
  },
  {
    id: "TK-004",
    title: "Password reset not working",
    customer: "Emma Wilson",
    priority: "high",
    status: "open",
    time: "25 min ago",
  },
  {
    id: "TK-002",
    title: "Billing inquiry about subscription",
    customer: "Sarah Johnson",
    priority: "medium",
    status: "in-progress",
    time: "1 hour ago",
  },
  {
    id: "TK-005",
    title: "Data export functionality",
    customer: "Alex Rodriguez",
    priority: "medium",
    status: "in-progress",
    time: "2 hours ago",
  },
];

// Sample data for team performance
const teamMembers = [
  {
    name: "Sarah Johnson",
    avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
    ticketsResolved: 23,
    responseTime: "1.2h",
    satisfaction: 98,
  },
  {
    name: "Mike Rodriguez",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    ticketsResolved: 19,
    responseTime: "1.8h", 
    satisfaction: 95,
  },
  {
    name: "Emma Chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c2a9?w=150&h=150&fit=crop&crop=face",
    ticketsResolved: 17,
    responseTime: "2.1h",
    satisfaction: 92,
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
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getInitials = (name: string) => {
  return name.split(" ").map(n => n[0]).join("").toUpperCase();
};

export default function Dashboard() {
  return (
    <div className="flex-1 overflow-auto">
      <Header title="Dashboard" subtitle="Overview of your support activities" />
      
      <main className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">456</div>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4h</div>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                -15% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Tickets */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Tickets</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {ticket.title}
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          {ticket.id}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{ticket.customer}</span>
                        <span>{ticket.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {teamMembers.map((member, index) => (
                  <div key={member.name} className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {member.ticketsResolved} tickets resolved
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Satisfaction</span>
                        <span className="text-gray-900 dark:text-white">{member.satisfaction}%</span>
                      </div>
                      <Progress value={member.satisfaction} className="h-2" />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>Response Time: {member.responseTime}</span>
                    </div>
                    {index < teamMembers.length - 1 && (
                      <div className="border-b border-gray-200 dark:border-gray-700"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                New Ticket
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Create a support ticket for a customer
              </p>
              <Button className="w-full">Create Ticket</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Add Customer
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Register a new customer in the system
              </p>
              <Button variant="outline" className="w-full">Add Customer</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                View Reports
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Access detailed analytics and reports
              </p>
              <Button variant="outline" className="w-full">View Reports</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
