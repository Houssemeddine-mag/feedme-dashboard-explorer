
import { useState, useEffect } from "react";
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
  Thermometer,
  CheckCircle,
  AlertCircle,
  Building,
  Plus,
  Edit,
  Trash2,
  Send,
  RefreshCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { supabase } from "@/integrations/supabase/client";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FeedMeLogo from "@/components/FeedMeLogo";
import { useAuth } from "@/hooks/useAuth";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// IoT Status Card Component
const IoTStatusCard = ({ title, value, status, unit, icon: Icon }: any) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={`h-4 w-4 ${status === 'normal' ? 'text-green-500' : 'text-yellow-500'}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}{unit}</div>
        <p className="text-xs text-muted-foreground">
          Status: {status === 'normal' ? 
            <span className="text-green-500">Normal</span> : 
            <span className="text-yellow-500">Attention</span>}
        </p>
      </CardContent>
    </Card>
  );
};

// Order summary component
const OrderSummary = ({ orders }: { orders: any[] }) => {
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
          {orders.length > 0 ? orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between pb-4 border-b last:border-0">
              <div>
                <div className="font-medium">Order #{order.id.substring(0, 8)}</div>
                <div className="text-sm text-gray-500">Table {order.table_number || 'Takeaway'}</div>
                <div className="text-xs text-gray-400 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(order.created_at).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">${order.total_amount.toFixed(2)}</div>
                <div className="text-sm text-gray-500">{order.status}</div>
              </div>
            </div>
          )) : (
            <div className="text-center py-4 text-gray-500">No recent orders</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Stats Card component
const StatCard = ({ title, value, icon: Icon, trend, description }: any) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="p-2 bg-primary/10 rounded-md">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {trend && (
          <div className={`text-xs flex items-center ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
            <span>{trend.value}%</span>
            <TrendingUp className={`h-3 w-3 ml-1 ${!trend.isPositive && "rotate-180"}`} />
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

// Daily dish component for menu creation
const DailyDishItem = ({ dish, ingredients, onQuantityChange, selectedQuantity = 0 }: any) => {
  // Calculate cost based on ingredients
  const calculateCost = () => {
    if (!dish.ingredients) return 0;
    
    return dish.ingredients.reduce((total: number, item: any) => {
      const ingredient = ingredients.find((ing: any) => ing.id === item.ingredient_id);
      if (ingredient) {
        return total + (ingredient.price_per_unit * item.quantity_needed * selectedQuantity);
      }
      return total;
    }, 0);
  };

  const cost = calculateCost();

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-0">
      <div className="flex items-center">
        {dish.image_url && (
          <img 
            src={dish.image_url} 
            alt={dish.name} 
            className="w-12 h-12 object-cover rounded-md mr-4"
          />
        )}
        <div>
          <div className="font-medium">{dish.name}</div>
          <div className="text-sm text-gray-500">{dish.category}</div>
          <div className="text-xs text-gray-400">${dish.price.toFixed(2)}</div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div>
          <div className="text-sm text-gray-500">Cost: <span className="font-medium">${cost.toFixed(2)}</span></div>
          <div className="text-xs text-gray-400">For {selectedQuantity} units</div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuantityChange(dish.id, Math.max(0, selectedQuantity - 1))}
            disabled={selectedQuantity <= 0}
          >
            -
          </Button>
          <Input 
            type="number" 
            min="0"
            value={selectedQuantity}
            onChange={(e) => onQuantityChange(dish.id, parseInt(e.target.value) || 0)}
            className="w-16 text-center h-8"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuantityChange(dish.id, selectedQuantity + 1)}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};

// Employee Item component
const EmployeeItem = ({ employee, onEdit, onDelete }: any) => {
  return (
    <div className="flex items-center justify-between p-4 border-b last:border-0">
      <div>
        <div className="font-medium">{employee.first_name} {employee.last_name}</div>
        <div className="text-sm text-gray-500">{employee.role}</div>
        <div className="text-xs text-gray-400">Hired: {new Date(employee.hire_date).toLocaleDateString()}</div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(employee)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => onDelete(employee)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Report Item component
const ReportItem = ({ report, onView, onEdit, onSend }: any) => {
  return (
    <div className="flex items-center justify-between p-4 border-b last:border-0">
      <div>
        <div className="font-medium">{report.title}</div>
        <div className="text-sm text-gray-500">{new Date(report.date).toLocaleDateString()}</div>
        <div className="text-xs flex items-center mt-1">
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            report.sent_to_admin ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {report.sent_to_admin ? 'Sent' : 'Draft'}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => onView(report)}>
          View
        </Button>
        {!report.sent_to_admin && (
          <>
            <Button variant="ghost" size="sm" onClick={() => onEdit(report)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-blue-500" onClick={() => onSend(report)}>
              <Send className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

const DirectorPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [dishes, setDishes] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [dailyMenus, setDailyMenus] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // IoT states
  const [ovenTemperature, setOvenTemperature] = useState(180);
  const [coolingTemperature, setCoolingTemperature] = useState(-4);
  const [isUpdatingTemperature, setIsUpdatingTemperature] = useState(false);

  // Dialog states
  const [isDailyMenuDialogOpen, setIsDailyMenuDialogOpen] = useState(false);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isViewReportDialogOpen, setIsViewReportDialogOpen] = useState(false);

  // Form states
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDishes, setSelectedDishes] = useState<Record<string, number>>({});
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);
  const [currentReport, setCurrentReport] = useState<any>(null);
  
  // Employee form state
  const [employeeForm, setEmployeeForm] = useState({
    first_name: '',
    last_name: '',
    role: 'waiter' as 'waiter' | 'chef' | 'cashier',
    phone: '',
    salary: '',
  });

  // Report form state
  const [reportForm, setReportForm] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Fetch data when the component mounts
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'director') {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You don't have permission to access this page.",
      });
      navigate('/');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Get director data
        const { data: directorData, error: directorError } = await supabase
          .from('directors')
          .select('*, restaurant:restaurants(*)')
          .eq('id', user.id)
          .single();

        if (directorError) throw directorError;
        
        if (directorData && directorData.restaurant) {
          setRestaurant(directorData.restaurant);

          // Get restaurant employees
          const { data: employeeData, error: employeeError } = await supabase
            .from('employees')
            .select('*')
            .eq('restaurant_id', directorData.restaurant.id);

          if (employeeError) throw employeeError;
          setEmployees(employeeData || []);

          // Get dishes with ingredients
          const { data: dishData, error: dishError } = await supabase
            .from('dishes')
            .select(`
              *,
              ingredients:dish_ingredients(
                id,
                quantity_needed,
                ingredient_id
              )
            `);

          if (dishError) throw dishError;
          setDishes(dishData || []);

          // Get ingredients
          const { data: ingredientData, error: ingredientError } = await supabase
            .from('ingredients')
            .select('*');

          if (ingredientError) throw ingredientError;
          setIngredients(ingredientData || []);

          // Get daily menus
          const { data: menuData, error: menuError } = await supabase
            .from('daily_menus')
            .select(`
              *,
              daily_dishes(
                id,
                dish_id,
                available_quantity
              )
            `)
            .eq('restaurant_id', directorData.restaurant.id);

          if (menuError) throw menuError;
          setDailyMenus(menuData || []);

          // Get reports
          const { data: reportData, error: reportError } = await supabase
            .from('reports')
            .select('*')
            .eq('restaurant_id', directorData.restaurant.id)
            .order('date', { ascending: false });

          if (reportError) throw reportError;
          setReports(reportData || []);

          // Get orders
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('restaurant_id', directorData.restaurant.id)
            .order('created_at', { ascending: false })
            .limit(5);

          if (orderError) throw orderError;
          setOrders(orderData || []);

          // Simulate getting IoT data
          const { data: iotData, error: iotError } = await supabase
            .from('restaurants')
            .select('oven_temperature, cooling_chamber_temperature')
            .eq('id', directorData.restaurant.id)
            .single();

          if (!iotError && iotData) {
            setOvenTemperature(iotData.oven_temperature || 180);
            setCoolingTemperature(iotData.cooling_chamber_temperature || -4);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: "destructive",
          title: "Failed to load data",
          description: "Could not retrieve restaurant data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, toast]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast({
      title: "Logged out successfully",
    });
  };

  // Create a new daily menu
  const handleCreateDailyMenu = async () => {
    try {
      // Check if menu already exists for this date
      const existingMenu = dailyMenus.find(menu => menu.date === selectedDate);
      
      let menuId;
      
      if (existingMenu) {
        menuId = existingMenu.id;
        
        // Delete existing daily dishes for this menu
        await supabase
          .from('daily_dishes')
          .delete()
          .eq('daily_menu_id', menuId);
      } else {
        // Create new daily menu
        const { data: menuData, error: menuError } = await supabase
          .from('daily_menus')
          .insert([
            { 
              restaurant_id: restaurant.id,
              created_by: user?.id,
              date: selectedDate
            }
          ])
          .select();

        if (menuError) throw menuError;
        menuId = menuData[0].id;
      }
      
      // Add dishes to the daily menu
      const dishesArray = Object.entries(selectedDishes)
        .filter(([_, quantity]) => quantity > 0)
        .map(([dishId, quantity]) => ({
          daily_menu_id: menuId,
          dish_id: dishId,
          available_quantity: quantity
        }));
      
      if (dishesArray.length > 0) {
        const { error: dishError } = await supabase
          .from('daily_dishes')
          .insert(dishesArray);

        if (dishError) throw dishError;
      }
      
      // Refresh daily menus
      const { data: newMenus, error: refreshError } = await supabase
        .from('daily_menus')
        .select(`
          *,
          daily_dishes(
            id,
            dish_id,
            available_quantity
          )
        `)
        .eq('restaurant_id', restaurant.id);

      if (refreshError) throw refreshError;
      setDailyMenus(newMenus || []);
      
      toast({
        title: "Daily menu created",
        description: `Menu for ${new Date(selectedDate).toLocaleDateString()} has been created.`,
      });
      
      setIsDailyMenuDialogOpen(false);
      setSelectedDishes({});
    } catch (error) {
      console.error('Error creating daily menu:', error);
      toast({
        variant: "destructive",
        title: "Failed to create menu",
        description: "An error occurred while creating the daily menu.",
      });
    }
  };

  // Update dish quantity for daily menu
  const handleDishQuantityChange = (dishId: string, quantity: number) => {
    setSelectedDishes(prev => ({
      ...prev,
      [dishId]: quantity
    }));
  };

  // Create or update an employee
  const handleEmployeeSubmit = async () => {
    try {
      const userData = {
        username: `${employeeForm.first_name.toLowerCase()}.${employeeForm.last_name.toLowerCase()}`,
        email: `${employeeForm.first_name.toLowerCase()}.${employeeForm.last_name.toLowerCase()}@feedme.com`,
        password_hash: employeeForm.first_name.toLowerCase(), // Simple password for demo
        role: employeeForm.role,
        phone_number: employeeForm.phone
      };

      if (currentEmployee) {
        // Update existing employee
        const { error: updateError } = await supabase
          .from('employees')
          .update({
            first_name: employeeForm.first_name,
            last_name: employeeForm.last_name,
            role: employeeForm.role,
            phone: employeeForm.phone,
            salary: employeeForm.salary ? parseFloat(employeeForm.salary) : null
          })
          .eq('id', currentEmployee.id);

        if (updateError) throw updateError;

        toast({
          title: "Employee updated",
          description: `${employeeForm.first_name} ${employeeForm.last_name}'s information has been updated.`,
        });
      } else {
        // Create new user first
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert([{
            username: `${employeeForm.first_name.toLowerCase()}.${employeeForm.last_name.toLowerCase()}`,
            email: `${employeeForm.first_name.toLowerCase()}.${employeeForm.last_name.toLowerCase()}@feedme.com`,
            password_hash: employeeForm.first_name.toLowerCase(), // Simple password for demo
            role: employeeForm.role,
            phone_number: employeeForm.phone
          }])
          .select();

        if (userError) throw userError;
        
        // Then create employee record
        const { error: employeeError } = await supabase
          .from('employees')
          .insert([{
            id: userData[0].id,
            restaurant_id: restaurant.id,
            first_name: employeeForm.first_name,
            last_name: employeeForm.last_name,
            role: employeeForm.role,
            phone: employeeForm.phone,
            salary: employeeForm.salary ? parseFloat(employeeForm.salary) : null
          }]);

        if (employeeError) throw employeeError;

        toast({
          title: "Employee added",
          description: `${employeeForm.first_name} ${employeeForm.last_name} has been added to your restaurant.`,
        });
      }

      // Refresh employees
      const { data: refreshData, error: refreshError } = await supabase
        .from('employees')
        .select('*')
        .eq('restaurant_id', restaurant.id);

      if (refreshError) throw refreshError;
      setEmployees(refreshData || []);
      
      setIsEmployeeDialogOpen(false);
      setCurrentEmployee(null);
      setEmployeeForm({
        first_name: '',
        last_name: '',
        role: 'waiter',
        phone: '',
        salary: '',
      });
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        variant: "destructive",
        title: "Failed to save employee",
        description: "An error occurred while saving the employee information.",
      });
    }
  };

  // Delete an employee
  const handleDeleteEmployee = async (employee: any) => {
    if (confirm(`Are you sure you want to remove ${employee.first_name} ${employee.last_name}?`)) {
      try {
        const { error } = await supabase
          .from('employees')
          .delete()
          .eq('id', employee.id);

        if (error) throw error;

        // Also delete user if needed
        // For this demo, we'll leave the user record intact

        toast({
          title: "Employee removed",
          description: `${employee.first_name} ${employee.last_name} has been removed.`,
        });

        // Update employees list
        setEmployees(employees.filter(e => e.id !== employee.id));
      } catch (error) {
        console.error('Error removing employee:', error);
        toast({
          variant: "destructive",
          title: "Failed to remove employee",
          description: "An error occurred while removing the employee.",
        });
      }
    }
  };

  // Edit an employee
  const handleEditEmployee = (employee: any) => {
    setCurrentEmployee(employee);
    setEmployeeForm({
      first_name: employee.first_name,
      last_name: employee.last_name,
      role: employee.role,
      phone: employee.phone || '',
      salary: employee.salary ? employee.salary.toString() : '',
    });
    setIsEmployeeDialogOpen(true);
  };

  // Create or update a report
  const handleReportSubmit = async () => {
    try {
      if (currentReport) {
        // Update existing report
        const { error } = await supabase
          .from('reports')
          .update({
            title: reportForm.title,
            content: reportForm.content,
            date: reportForm.date,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentReport.id);

        if (error) throw error;

        toast({
          title: "Report updated",
          description: "Your report has been updated successfully.",
        });
      } else {
        // Create new report
        const { error } = await supabase
          .from('reports')
          .insert([{
            title: reportForm.title,
            content: reportForm.content,
            date: reportForm.date,
            employee_id: user?.id,
            restaurant_id: restaurant.id,
            status: 'pending',
            sent_to_admin: false
          }]);

        if (error) throw error;

        toast({
          title: "Report created",
          description: "Your report has been created successfully.",
        });
      }

      // Refresh reports
      const { data, error: refreshError } = await supabase
        .from('reports')
        .select('*')
        .eq('restaurant_id', restaurant.id)
        .order('date', { ascending: false });

      if (refreshError) throw refreshError;
      setReports(data || []);
      
      setIsReportDialogOpen(false);
      setCurrentReport(null);
      setReportForm({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        variant: "destructive",
        title: "Failed to save report",
        description: "An error occurred while saving the report.",
      });
    }
  };

  // Send a report to admin
  const handleSendReport = async (report: any) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({
          sent_to_admin: true,
          status: 'sent',
          updated_at: new Date().toISOString()
        })
        .eq('id', report.id);

      if (error) throw error;

      toast({
        title: "Report sent",
        description: "Your report has been sent to the admin.",
      });

      // Update in the UI
      setReports(reports.map(r => 
        r.id === report.id ? { ...r, sent_to_admin: true, status: 'sent' } : r
      ));
    } catch (error) {
      console.error('Error sending report:', error);
      toast({
        variant: "destructive",
        title: "Failed to send report",
        description: "An error occurred while sending the report.",
      });
    }
  };

  // View a report
  const handleViewReport = (report: any) => {
    setCurrentReport(report);
    setIsViewReportDialogOpen(true);
  };

  // Edit a report
  const handleEditReport = (report: any) => {
    setCurrentReport(report);
    setReportForm({
      title: report.title,
      content: report.content,
      date: report.date,
    });
    setIsReportDialogOpen(true);
  };

  // Refresh IoT data
  const handleRefreshIoT = async () => {
    setIsUpdatingTemperature(true);
    try {
      // Simulate getting new readings with slight variations
      const newOvenTemp = Math.floor(ovenTemperature + (Math.random() * 10 - 5));
      const newCoolingTemp = Math.round((coolingTemperature + (Math.random() * 2 - 1)) * 10) / 10;
      
      // Update in database
      const { error } = await supabase
        .from('restaurants')
        .update({
          oven_temperature: newOvenTemp,
          cooling_chamber_temperature: newCoolingTemp
        })
        .eq('id', restaurant.id);

      if (error) throw error;
      
      setOvenTemperature(newOvenTemp);
      setCoolingTemperature(newCoolingTemp);
      
      toast({
        title: "IoT data updated",
        description: "Latest temperature readings have been retrieved.",
      });
    } catch (error) {
      console.error('Error updating IoT data:', error);
      toast({
        variant: "destructive",
        title: "Failed to update IoT data",
        description: "An error occurred while fetching the latest readings.",
      });
    } finally {
      setIsUpdatingTemperature(false);
    }
  };

  // Sales data for the chart
  const getSalesData = () => {
    // In a real app, this would come from the database
    // Here, we'll generate some random data based on orders
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      name: day,
      value: Math.floor(Math.random() * 1000) + 500
    }));
  };

  // Category data for the chart
  const getCategoryData = () => {
    const categoryCounts: Record<string, number> = {};
    
    // Count dishes by category
    dishes.forEach(dish => {
      if (dish.category) {
        categoryCounts[dish.category] = (categoryCounts[dish.category] || 0) + 1;
      }
    });
    
    // Convert to array format for chart
    return Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-feedme-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading restaurant data...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building className="h-12 w-12 mx-auto text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold">No Restaurant Assigned</h2>
          <p className="mt-2 text-gray-500">You haven't been assigned to a restaurant yet.</p>
          <Button onClick={handleLogout} className="mt-4">
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

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
                <h1 className="text-xl font-bold">{restaurant.name}</h1>
                <p className="text-sm text-gray-500">{restaurant.address || 'No address'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-right">
                <div className="font-medium">Director Dashboard</div>
                <div className="text-gray-500">Welcome, {user?.username}</div>
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
                value={`$${(orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)).toFixed(2)}`}
                icon={CreditCard}
                trend={{ value: 12.5, isPositive: true }}
                description="Based on today's orders"
              />
              <StatCard 
                title="Total Orders" 
                value={orders.length}
                icon={Package}
                trend={{ value: 8.2, isPositive: true }}
              />
              <StatCard 
                title="Total Employees" 
                value={employees.length}
                icon={Users}
              />
              <StatCard 
                title="Most Popular Dish" 
                value={dishes.length > 0 ? dishes[0].name : "No dishes"}
                icon={UtensilsCrossed}
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
                      <AreaChart data={getSalesData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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

              <OrderSummary orders={orders} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>Dishes by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getCategoryData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" name="Dishes" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>IoT Monitoring</CardTitle>
                    <CardDescription>Real-time temperature tracking</CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleRefreshIoT} 
                    disabled={isUpdatingTemperature}
                  >
                    <RefreshCcw className={`h-4 w-4 mr-2 ${isUpdatingTemperature ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <IoTStatusCard
                      title="Kitchen Ovens"
                      value={ovenTemperature}
                      unit="°C"
                      status={ovenTemperature > 200 || ovenTemperature < 160 ? 'warning' : 'normal'}
                      icon={Thermometer}
                    />
                    <IoTStatusCard
                      title="Cooling Chamber"
                      value={coolingTemperature}
                      unit="°C"
                      status={coolingTemperature > -2 || coolingTemperature < -8 ? 'warning' : 'normal'}
                      icon={Thermometer}
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      <p className="flex items-center mb-1">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        <span>Normal range for ovens: 160°C - 200°C</span>
                      </p>
                      <p className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        <span>Normal range for cooling: -8°C - -2°C</span>
                      </p>
                    </div>
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
                  <Button onClick={() => {
                    setSelectedDishes({});
                    setSelectedDate(new Date().toISOString().split('T')[0]);
                    setIsDailyMenuDialogOpen(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Menu
                  </Button>
                </CardTitle>
                <CardDescription>
                  Create and manage daily menus based on available dishes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dailyMenus.length > 0 ? (
                  <div className="space-y-4">
                    {dailyMenus.map(menu => (
                      <Card key={menu.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{new Date(menu.date).toLocaleDateString()}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {menu.daily_dishes && menu.daily_dishes.length > 0 ? (
                            <div className="space-y-2">
                              {menu.daily_dishes.map((dailyDish: any) => {
                                const dish = dishes.find(d => d.id === dailyDish.dish_id);
                                if (!dish) return null;
                                
                                return (
                                  <div key={dailyDish.id} className="flex justify-between items-center p-2 border-b">
                                    <div className="flex items-center">
                                      {dish.image_url && (
                                        <img 
                                          src={dish.image_url} 
                                          alt={dish.name} 
                                          className="w-10 h-10 object-cover rounded-md mr-3"
                                        />
                                      )}
                                      <div>
                                        <div className="font-medium">{dish.name}</div>
                                        <div className="text-sm text-gray-500">{dish.category}</div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-medium">${dish.price.toFixed(2)}</div>
                                      <div className="text-sm text-gray-500">Qty: {dailyDish.available_quantity}</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-center py-4">No dishes in this menu</p>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-end">
                          <Button variant="outline" size="sm" onClick={() => {
                            // Pre-fill form for editing
                            const dishQuantities: Record<string, number> = {};
                            menu.daily_dishes.forEach((dailyDish: any) => {
                              dishQuantities[dailyDish.dish_id] = dailyDish.available_quantity;
                            });
                            
                            setSelectedDishes(dishQuantities);
                            setSelectedDate(menu.date);
                            setIsDailyMenuDialogOpen(true);
                          }}>
                            Edit Menu
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <UtensilsCrossed className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No menus created yet</h3>
                    <p className="mt-1 text-gray-500">
                      Create your first daily menu by clicking the "Create New Menu" button.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Dishes</CardTitle>
                  <CardDescription>All dishes available for daily menus</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dishes.length > 0 ? dishes.map((dish) => (
                      <div key={dish.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                        <div className="flex items-center">
                          {dish.image_url && (
                            <img 
                              src={dish.image_url} 
                              alt={dish.name} 
                              className="w-12 h-12 object-cover rounded-md mr-3"
                            />
                          )}
                          <div>
                            <div className="font-medium">{dish.name}</div>
                            <div className="text-sm text-gray-500">{dish.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${dish.price.toFixed(2)}</div>
                        </div>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-center py-4">No dishes available</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ingredient Inventory</CardTitle>
                  <CardDescription>Current stock levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ingredients.length > 0 ? ingredients.map((ingredient) => (
                      <div key={ingredient.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                        <div>
                          <div className="font-medium">{ingredient.name}</div>
                          <div className="text-sm text-gray-500">{ingredient.current_stock} {ingredient.unit} available</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${ingredient.price_per_unit.toFixed(2)}/{ingredient.unit}</div>
                        </div>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-center py-4">No ingredients available</p>
                    )}
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
                  <Button onClick={() => {
                    setCurrentEmployee(null);
                    setEmployeeForm({
                      first_name: '',
                      last_name: '',
                      role: 'waiter',
                      phone: '',
                      salary: '',
                    });
                    setIsEmployeeDialogOpen(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Employee
                  </Button>
                </CardTitle>
                <CardDescription>
                  Manage your restaurant staff
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employees.length > 0 ? (
                    employees.map(employee => (
                      <EmployeeItem 
                        key={employee.id} 
                        employee={employee}
                        onEdit={handleEditEmployee}
                        onDelete={handleDeleteEmployee}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No employees added yet</h3>
                      <p className="mt-1 text-gray-500">
                        Add your first employee by clicking the "Add New Employee" button.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* REPORTS TAB */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Reports Management</span>
                  <Button onClick={() => {
                    setCurrentReport(null);
                    setReportForm({
                      title: '',
                      content: '',
                      date: new Date().toISOString().split('T')[0],
                    });
                    setIsReportDialogOpen(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Report
                  </Button>
                </CardTitle>
                <CardDescription>
                  Create and send reports to the admin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.length > 0 ? (
                    reports.map(report => (
                      <ReportItem 
                        key={report.id} 
                        report={report}
                        onView={handleViewReport}
                        onEdit={handleEditReport}
                        onSend={handleSendReport}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No reports created yet</h3>
                      <p className="mt-1 text-gray-500">
                        Create your first report by clicking the "Create New Report" button.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Daily Menu Dialog */}
      <Dialog open={isDailyMenuDialogOpen} onOpenChange={setIsDailyMenuDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Daily Menu</DialogTitle>
            <DialogDescription>
              Select dishes and quantities for your daily menu
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid items-center gap-2">
              <Label htmlFor="date">Menu Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-4 mt-4">
              <h4 className="font-medium">Available Dishes</h4>
              <div className="border rounded-md divide-y max-h-[400px] overflow-y-auto">
                {dishes.map(dish => (
                  <DailyDishItem
                    key={dish.id}
                    dish={dish}
                    ingredients={ingredients}
                    onQuantityChange={handleDishQuantityChange}
                    selectedQuantity={selectedDishes[dish.id] || 0}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDailyMenuDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateDailyMenu}>
              Save Menu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employee Dialog */}
      <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentEmployee ? 'Edit Employee' : 'Add New Employee'}
            </DialogTitle>
            <DialogDescription>
              {currentEmployee ? 'Update employee information' : 'Add a new employee to your restaurant'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={employeeForm.first_name}
                  onChange={(e) => setEmployeeForm({...employeeForm, first_name: e.target.value})}
                  placeholder="John"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={employeeForm.last_name}
                  onChange={(e) => setEmployeeForm({...employeeForm, last_name: e.target.value})}
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={employeeForm.role} 
                onValueChange={(value: any) => setEmployeeForm({...employeeForm, role: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="waiter">Waiter</SelectItem>
                  <SelectItem value="chef">Chef</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={employeeForm.phone}
                onChange={(e) => setEmployeeForm({...employeeForm, phone: e.target.value})}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                type="number"
                value={employeeForm.salary}
                onChange={(e) => setEmployeeForm({...employeeForm, salary: e.target.value})}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEmployeeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEmployeeSubmit}>
              {currentEmployee ? 'Update Employee' : 'Add Employee'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentReport ? 'Edit Report' : 'Create New Report'}
            </DialogTitle>
            <DialogDescription>
              {currentReport ? 'Update your report details' : 'Create a new report to send to admin'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Report Title</Label>
              <Input
                id="title"
                value={reportForm.title}
                onChange={(e) => setReportForm({...reportForm, title: e.target.value})}
                placeholder="Monthly Performance Report"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Report Date</Label>
              <Input
                id="date"
                type="date"
                value={reportForm.date}
                onChange={(e) => setReportForm({...reportForm, date: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Report Content</Label>
              <Textarea
                id="content"
                value={reportForm.content}
                onChange={(e) => setReportForm({...reportForm, content: e.target.value})}
                placeholder="Enter your report details here..."
                className="min-h-[200px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsReportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleReportSubmit}>
              {currentReport ? 'Update Report' : 'Create Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Report Dialog */}
      <Dialog open={isViewReportDialogOpen} onOpenChange={setIsViewReportDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentReport?.title}
            </DialogTitle>
            <DialogDescription>
              Created on {currentReport && new Date(currentReport.date).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{currentReport?.content}</p>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>
                  Status: 
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    currentReport?.sent_to_admin ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {currentReport?.sent_to_admin ? 'Sent to Admin' : 'Draft'}
                  </span>
                </div>
                <div>
                  Last updated: {currentReport && new Date(currentReport.updated_at).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsViewReportDialogOpen(false)}>
              Close
            </Button>
            {!currentReport?.sent_to_admin && (
              <Button 
                variant="default"
                onClick={() => {
                  setIsViewReportDialogOpen(false);
                  handleSendReport(currentReport);
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Send to Admin
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DirectorPage;
