import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";

export default function Customers() {
  return (
    <div className="flex-1 overflow-auto">
      <Header title="Customers" subtitle="Manage your customer relationships" />
      
      <main className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search customers..."
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
        
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No customers found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start building your customer base by adding your first customer.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add First Customer
          </Button>
        </div>
      </main>
    </div>
  );
}
