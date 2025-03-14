
import { DataTable } from "@/components/ui/data-table";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { 
  ActivitySquare, 
  ChefHat, 
  Clock, 
  Mail, 
  Store,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data
const restaurantData = [
  { 
    id: 1, 
    name: "FeedMe Downtown", 
    status: "open", 
    sales: 5320,
    director: "John Smith",
    email: "j.smith@feedme.com"
  },
  { 
    id: 2, 
    name: "FeedMe Riverside", 
    status: "open", 
    sales: 4780,
    director: "Emma Jones",
    email: "e.jones@feedme.com"
  },
  { 
    id: 3, 
    name: "FeedMe Central Park", 
    status: "closed", 
    sales: 0,
    director: "Robert Wilson",
    email: "r.wilson@feedme.com"
  },
  { 
    id: 4, 
    name: "FeedMe Business District", 
    status: "open", 
    sales: 6120,
    director: "Sarah Miller",
    email: "s.miller@feedme.com"
  },
  { 
    id: 5, 
    name: "FeedMe Harbor View", 
    status: "closed", 
    sales: 0,
    director: "Michael Brown",
    email: "m.brown@feedme.com"
  },
];

const Dashboard = () => {
  const filterOptions = [
    { label: "All Restaurants", value: "all" },
    { label: "Open Only", value: "open" },
    { label: "Closed Only", value: "closed" },
  ];

  const columns = [
    {
      header: "Status",
      accessorKey: "status",
      cell: (restaurant: any) => (
        <Badge 
          className={`${
            restaurant.status === "open" 
              ? "bg-green-100 text-green-800 hover:bg-green-100" 
              : "bg-red-100 text-red-800 hover:bg-red-100"
          }`}
        >
          {restaurant.status === "open" ? "Open" : "Closed"}
        </Badge>
      ),
    },
    {
      header: "Restaurant",
      accessorKey: "name",
    },
    {
      header: "Director",
      accessorKey: "director",
    },
    {
      header: "Today's Sales",
      accessorKey: "sales",
      cell: (restaurant: any) => (
        <span>
          {restaurant.status === "open" 
            ? `$${restaurant.sales.toLocaleString()}` 
            : "N/A"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (restaurant: any) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="h-8 px-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="sr-only">View Report</span>
          </Button>
          <Button size="sm" variant="outline" className="h-8 px-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="sr-only">Email Director</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-500">
          Overview of your restaurant chain performance.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Dishes Sold Today"
          value="1,248"
          icon={ChefHat}
          trend={{ value: 12, isPositive: true }}
          description="Compared to yesterday"
        />
        <StatsCard
          title="Dishes Sold Per Hour"
          value="32"
          icon={Clock}
          trend={{ value: 4, isPositive: true }}
          description="Current hourly rate"
        />
        <StatsCard
          title="Best Performing Restaurant"
          value="FeedMe Business District"
          icon={Store}
          description="$6,120 in sales today"
        />
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-4">Restaurant Status</h2>
        <DataTable
          data={restaurantData}
          columns={columns}
          filterOptions={filterOptions}
        />
      </div>
    </div>
  );
};

export default Dashboard;
