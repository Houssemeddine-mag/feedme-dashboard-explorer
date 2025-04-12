
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  FileText,
  Package,
  TrendingUp,
  CreditCard,
  ChevronRight,
  Calendar,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useToast } from "@/components/ui/use-toast";
import FeedMeLogo from "@/components/FeedMeLogo";

// Mock data for charts
const salesData = [
  { name: "Mon", value: 1200 },
  { name: "Tue", value: 900 },
  { name: "Wed", value: 1500 },
  { name: "Thu", value: 1800 },
  { name: "Fri", value: 2400 },
  { name: "Sat", value: 2800 },
  { name: "Sun", value: 2000 },
];

const categoryData = [
  { name: "Pizza", value: 35 },
  { name: "Pasta", value: 25 },
  { name: "Salads", value: 15 },
  { name: "Burgers", value: 20 },
  { name: "Desserts", value: 5 },
];

// Order summary component
const OrderSummary = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>
          Last 5 orders from the restaurant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { id: "ORD-7245", table: 5, time: "10 minutes ago", amount: 89.99, items: 3 },
            { id: "ORD-7244", table: 12, time: "25 minutes ago", amount: 45.50, items: 2 },
            { id: "ORD-7243", table: 8, time: "1 hour ago", amount: 124.99, items: 5 },
            { id: "ORD-7242", table: 3, time: "3 hours ago", amount: 74.50, items: 4 },
            { id: "ORD-7241", table: 7, time: "5 hours ago", amount: 52.25, items: 2 },
          ].map((order) => (
            <div key={order.id} className="flex items-center justify-between pb-4 border-b last:border-0">
              <div>
                <div className="font-medium">{order.id}</div>
                <div className="text-sm text-gray-500">Table {order.table}</div>
                <div className="text-xs text-gray-400 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {order.time}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">${order.amount.toFixed(2)}</div>
                <div className="text-sm text-gray-500">{order.items} items</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Stats Card component
const StatCard = ({ title, value, icon, trend, description }: any) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="p-2 bg-primary/10 rounded-md">
          {icon}
        </div>
        {trend && (
          <div className={`text-xs flex items-center ${trend.positive ? "text-green-600" : "text-red-600"}`}>
            <span>{trend.value}%</span>
            <TrendingUp className={`h-3 w-3 ml-1 ${!trend.positive && "rotate-180"}`} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{title}</p>
        {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
      </CardContent>
    </Card>
  );
};

const DirectorPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    navigate("/login");
    toast({
      title: "Logged out successfully",
    });
  };

  // Mock restaurant data
  const restaurantData = {
    name: "FeedMe Main Restaurant",
    address: "123 Main Street, Cityville",
    employees: 24,
    dailyRevenue: 3854.75,
    orderCount: 142,
    popularDish: "Margherita Pizza",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-4">
                <FeedMeLogo className="w-32" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{restaurantData.name}</h1>
                <p className="text-sm text-gray-500">{restaurantData.address}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-right">
                <div className="font-medium">Director Dashboard</div>
                <div className="text-gray-500">Welcome, Restaurant Director</div>
              </div>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <TabsList className="grid grid-cols-4 w-[500px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="menu">Daily Menu</TabsTrigger>
              <TabsTrigger value="grh">GRH</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <p className="text-sm text-gray-500">
              <Calendar className="w-4 h-4 inline-block mr-1" /> 
              Today: {new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Today's Revenue" 
                value={`$${restaurantData.dailyRevenue.toFixed(2)}`}
                icon={<CreditCard className="h-5 w-5 text-primary" />}
                trend={{ value: 12.5, positive: true }}
                description="12.5% increase from yesterday"
              />
              <StatCard 
                title="Total Orders" 
                value={restaurantData.orderCount}
                icon={<Package className="h-5 w-5 text-primary" />}
                trend={{ value: 8.2, positive: true }}
              />
              <StatCard 
                title="Total Employees" 
                value={restaurantData.employees}
                icon={<Users className="h-5 w-5 text-primary" />}
              />
              <StatCard 
                title="Most Popular" 
                value={restaurantData.popularDish}
                icon={<UtensilsCrossed className="h-5 w-5 text-primary" />}
                description="Based on today's orders"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Weekly Sales</CardTitle>
                  <CardDescription>Revenue overview for the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <OrderSummary />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>Orders by menu category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" name="Percentage" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Activities</CardTitle>
                  <CardDescription>Schedule for the next few days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Supplier meeting", date: "Tomorrow, 10:00 AM", type: "Meeting" },
                      { title: "Inventory check", date: "Tomorrow, 4:00 PM", type: "Task" },
                      { title: "Staff training", date: "Apr 14, 2:00 PM", type: "Event" },
                      { title: "Menu review", date: "Apr 15, 11:00 AM", type: "Meeting" },
                    ].map((activity, i) => (
                      <div key={i} className="flex justify-between pb-4 border-b last:border-0">
                        <div>
                          <div className="font-medium">{activity.title}</div>
                          <div className="text-sm text-gray-500">{activity.date}</div>
                        </div>
                        <div>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {activity.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* DAILY MENU TAB */}
          <TabsContent value="menu" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Today's Menu Management</span>
                  <Button>Create New Menu</Button>
                </CardTitle>
                <CardDescription>
                  Add and manage dishes for today's menu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-10">
                  To implement the daily menu management, please click on the "Create New Menu" button. This will allow you to select dishes, set quantities, and manage ingredients.
                </p>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Dishes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Margherita Pizza", category: "Pizza", price: 12.99 },
                      { name: "Carbonara Pasta", category: "Pasta", price: 14.99 },
                      { name: "Caesar Salad", category: "Salad", price: 8.99 },
                      { name: "Beef Burger", category: "Burgers", price: 15.99 },
                      { name: "Tiramisu", category: "Dessert", price: 7.99 },
                    ].map((dish, i) => (
                      <div key={i} className="flex justify-between items-center pb-4 border-b last:border-0">
                        <div>
                          <div className="font-medium">{dish.name}</div>
                          <div className="text-sm text-gray-500">{dish.category}</div>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-4 font-medium">${dish.price.toFixed(2)}</div>
                          <Button size="sm" variant="outline">Add to Menu</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ingredient Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Flour", stock: "100 kg", price: "$1.50/kg" },
                      { name: "Tomatoes", stock: "50 kg", price: "$2.80/kg" },
                      { name: "Mozzarella", stock: "30 kg", price: "$9.50/kg" },
                      { name: "Beef", stock: "40 kg", price: "$15.00/kg" },
                      { name: "Lettuce", stock: "20 kg", price: "$2.20/kg" },
                    ].map((ingredient, i) => (
                      <div key={i} className="flex justify-between items-center pb-4 border-b last:border-0">
                        <div>
                          <div className="font-medium">{ingredient.name}</div>
                          <div className="text-sm text-gray-500">{ingredient.stock} available</div>
                        </div>
                        <div className="text-sm font-medium">
                          {ingredient.price}
                        </div>
                      </div>
                    ))}
                    <Button className="w-full mt-4">View Ingredient Invoice</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* GRH TAB */}
          <TabsContent value="grh" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Human Resources Management</span>
                  <div className="flex space-x-2">
                    <Button>Add New Employee</Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Manage your restaurant staff
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="all">All Staff</TabsTrigger>
                    <TabsTrigger value="chefs">Chefs</TabsTrigger>
                    <TabsTrigger value="waiters">Waiters</TabsTrigger>
                    <TabsTrigger value="cashiers">Cashiers</TabsTrigger>
                    <TabsTrigger value="delivery">Delivery</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4">
                    <div className="border rounded-md">
                      <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b bg-muted/50">
                        <div>Name</div>
                        <div>Role</div>
                        <div>Hire Date</div>
                        <div>Status</div>
                        <div className="text-right">Actions</div>
                      </div>
                      {[
                        { name: "John Smith", role: "Head Chef", date: "Jan 15, 2023", status: "Active" },
                        { name: "Emma Johnson", role: "Waiter", date: "Mar 5, 2023", status: "Active" },
                        { name: "Michael Brown", role: "Cashier", date: "Feb 10, 2023", status: "On Leave" },
                        { name: "Sarah Wilson", role: "Sous Chef", date: "Jan 20, 2023", status: "Active" },
                        { name: "James Taylor", role: "Delivery", date: "Apr 1, 2023", status: "Active" },
                      ].map((employee, i) => (
                        <div key={i} className="grid grid-cols-5 gap-4 p-4 items-center border-b last:border-0">
                          <div className="font-medium">{employee.name}</div>
                          <div>{employee.role}</div>
                          <div className="text-gray-500">{employee.date}</div>
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              employee.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {employee.status}
                            </span>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm" className="text-red-600">Remove</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* REPORTS TAB */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Reports Management</span>
                  <Button>Create New Report</Button>
                </CardTitle>
                <CardDescription>
                  View and create reports for the admin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b bg-muted/50">
                    <div>Title</div>
                    <div>Author</div>
                    <div>Date</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {[
                    { title: "Monthly Financial Summary", author: "Director", date: "Apr 5, 2023", status: "Sent" },
                    { title: "Staff Performance Review", author: "Director", date: "Mar 28, 2023", status: "Draft" },
                    { title: "Inventory Shortage Alert", author: "Head Chef", date: "Apr 2, 2023", status: "Pending" },
                    { title: "Customer Satisfaction Survey", author: "Waiter Lead", date: "Mar 25, 2023", status: "Sent" },
                    { title: "Equipment Maintenance Request", author: "Sous Chef", date: "Apr 1, 2023", status: "Pending" },
                  ].map((report, i) => (
                    <div key={i} className="grid grid-cols-5 gap-4 p-4 items-center border-b last:border-0">
                      <div className="font-medium">{report.title}</div>
                      <div>{report.author}</div>
                      <div className="text-gray-500">{report.date}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          report.status === "Sent" 
                            ? "bg-green-100 text-green-800"
                            : report.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
                        {report.status !== "Sent" && (
                          <Button variant="ghost" size="sm" className="text-blue-600">Send</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DirectorPage;
