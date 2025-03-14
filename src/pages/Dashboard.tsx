import { DataTable } from "@/components/ui/data-table";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { 
  ActivitySquare, 
  AlertTriangle,
  BarChart3,
  ChefHat, 
  Clock, 
  DollarSign,
  Mail, 
  Store,
  FileText,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const restaurantData = [
  { 
    id: 1, 
    name: "FeedMe Downtown", 
    status: "open", 
    sales: 5320,
    director: "John Smith",
    email: "j.smith@feedme.com",
    staffCount: 24,
    alertLevel: "low"
  },
  { 
    id: 2, 
    name: "FeedMe Riverside", 
    status: "open", 
    sales: 4780,
    director: "Emma Jones",
    email: "e.jones@feedme.com",
    staffCount: 18,
    alertLevel: "medium"
  },
  { 
    id: 3, 
    name: "FeedMe Central Park", 
    status: "closed", 
    sales: 0,
    director: "Robert Wilson",
    email: "r.wilson@feedme.com",
    staffCount: 22,
    alertLevel: "none"
  },
  { 
    id: 4, 
    name: "FeedMe Business District", 
    status: "open", 
    sales: 6120,
    director: "Sarah Miller",
    email: "s.miller@feedme.com",
    staffCount: 30,
    alertLevel: "none"
  },
  { 
    id: 5, 
    name: "FeedMe Harbor View", 
    status: "closed", 
    sales: 0,
    director: "Michael Brown",
    email: "m.brown@feedme.com",
    staffCount: 20,
    alertLevel: "high"
  },
];

const staffingIssues = [
  { restaurant: "FeedMe Harbor View", position: "Chef", status: "Understaffed", priority: "High" },
  { restaurant: "FeedMe Downtown", position: "Waitstaff", status: "Shift Coverage", priority: "Medium" },
  { restaurant: "FeedMe Riverside", position: "Manager", status: "On Leave", priority: "Medium" },
];

const operationalIssues = [
  { restaurant: "FeedMe Harbor View", issue: "Facility Maintenance", details: "HVAC system failure", priority: "High" },
  { restaurant: "FeedMe Business District", issue: "Director Absence", details: "Sarah Miller will be unavailable next week", priority: "Medium" },
  { restaurant: "FeedMe Central Park", issue: "Reopening Delayed", details: "Inspection pending", priority: "High" },
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
      header: "Staff",
      accessorKey: "staffCount",
      cell: (restaurant: any) => (
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1 text-gray-500" />
          <span>{restaurant.staffCount}</span>
        </div>
      ),
    },
    {
      header: "Alert Level",
      accessorKey: "alertLevel",
      cell: (restaurant: any) => {
        const alertClasses = {
          none: "bg-gray-100 text-gray-800 hover:bg-gray-100",
          low: "bg-blue-100 text-blue-800 hover:bg-blue-100",
          medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
          high: "bg-red-100 text-red-800 hover:bg-red-100"
        };
        
        return (
          <Badge 
            className={alertClasses[restaurant.alertLevel as keyof typeof alertClasses]}
          >
            {restaurant.alertLevel !== "none" 
              ? restaurant.alertLevel.charAt(0).toUpperCase() + restaurant.alertLevel.slice(1) 
              : "None"}
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (restaurant: any) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="h-8 px-2">
            <BarChart3 className="h-4 w-4 text-gray-500" />
            <span className="sr-only">View Stats</span>
          </Button>
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
          title="Daily Revenue"
          value="$16,220"
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
          description="Across all restaurants"
        />
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Issues</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div>
            <h2 className="text-lg font-medium mb-4">Restaurant Status</h2>
            <DataTable
              data={restaurantData}
              columns={columns}
              filterOptions={filterOptions}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-500" />
                  Staffing Issues
                </CardTitle>
                <CardDescription>Current staffing problems that need attention</CardDescription>
              </CardHeader>
              <CardContent>
                {staffingIssues.length > 0 ? (
                  <div className="space-y-4">
                    {staffingIssues.map((issue, index) => (
                      <div key={index} className="flex justify-between items-center pb-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{issue.restaurant}</p>
                          <p className="text-sm text-gray-500">{issue.position} - {issue.status}</p>
                        </div>
                        <Badge 
                          className={issue.priority === "High"
                            ? "bg-red-100 text-red-800 hover:bg-red-100" 
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"}
                        >
                          {issue.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No staffing issues</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                  Critical Issues
                </CardTitle>
                <CardDescription>Operational problems requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                {operationalIssues.length > 0 ? (
                  <div className="space-y-4">
                    {operationalIssues.map((issue, index) => (
                      <div key={index} className="flex justify-between pb-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{issue.restaurant}</p>
                          <p className="text-sm font-medium text-gray-700">{issue.issue}</p>
                          <p className="text-xs text-gray-500">{issue.details}</p>
                        </div>
                        <Badge 
                          className={issue.priority === "High"
                            ? "bg-red-100 text-red-800 hover:bg-red-100" 
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"}
                        >
                          {issue.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No critical issues</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Performance</CardTitle>
              <CardDescription>Comparative analysis across locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {restaurantData
                  .filter(restaurant => restaurant.status === "open")
                  .sort((a, b) => b.sales - a.sales)
                  .map((restaurant, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{restaurant.name}</span>
                        <span className="font-medium">${restaurant.sales.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={(restaurant.sales / 6120) * 100} 
                        className="h-2" 
                      />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
