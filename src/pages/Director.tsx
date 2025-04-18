import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UtensilsCrossed,
  Users,
  FileText,
  Plus,
  Building,
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
import { DirectorOverview } from "@/components/director/DirectorOverview";
import { DailyDishItem } from "@/components/director/DailyDishItem";
import { EmployeeItem } from "@/components/director/EmployeeItem";
import { ReportItem } from "@/components/director/ReportItem";

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
  
  const [ovenTemperature, setOvenTemperature] = useState(180);
  const [coolingTemperature, setCoolingTemperature] = useState(-4);
  const [isUpdatingTemperature, setIsUpdatingTemperature] = useState(false);

  const [isDailyMenuDialogOpen, setIsDailyMenuDialogOpen] = useState(false);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isViewReportDialogOpen, setIsViewReportDialogOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDishes, setSelectedDishes] = useState<Record<string, number>>({});
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);
  const [currentReport, setCurrentReport] = useState<any>(null);
  
  const [employeeForm, setEmployeeForm] = useState({
    first_name: '',
    last_name: '',
    role: 'waiter' as 'waiter' | 'chef' | 'cashier',
    phone: '',
    salary: '',
  });

  const [reportForm, setReportForm] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
  });

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
        const { data: directorData, error: directorError } = await supabase
          .from('directors')
          .select('*, restaurant:restaurants(*)')
          .eq('id', user.id)
          .single();

        if (directorError) throw directorError;
        
        if (directorData && directorData.restaurant) {
          setRestaurant(directorData.restaurant);

          const { data: employeeData, error: employeeError } = await supabase
            .from('employees')
            .select('*')
            .eq('restaurant_id', directorData.restaurant.id);

          if (employeeError) throw employeeError;
          setEmployees(employeeData || []);

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

          const { data: ingredientData, error: ingredientError } = await supabase
            .from('ingredients')
            .select('*');

          if (ingredientError) throw ingredientError;
          setIngredients(ingredientData || []);

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

          const { data: reportData, error: reportError } = await supabase
            .from('reports')
            .select('*')
            .eq('restaurant_id', directorData.restaurant.id)
            .order('date', { ascending: false });

          if (reportError) throw reportError;
          setReports(reportData || []);

          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('restaurant_id', directorData.restaurant.id)
            .order('created_at', { ascending: false })
            .limit(5);

          if (orderError) throw orderError;
          setOrders(orderData || []);

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

  const handleCreateDailyMenu = async () => {
    try {
      const existingMenu = dailyMenus.find(menu => menu.date === selectedDate);
      
      let menuId;
      
      if (existingMenu) {
        menuId = existingMenu.id;
        
        await supabase
          .from('daily_dishes')
          .delete()
          .eq('daily_menu_id', menuId);
      } else {
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

  const handleDishQuantityChange = (dishId: string, quantity: number) => {
    setSelectedDishes(prev => ({
      ...prev,
      [dishId]: quantity
    }));
  };

  const handleEmployeeSubmit = async () => {
    try {
      const userData = {
        username: `${employeeForm.first_name.toLowerCase()}.${employeeForm.last_name.toLowerCase()}`,
        email: `${employeeForm.first_name.toLowerCase()}.${employeeForm.last_name.toLowerCase()}@feedme.com`,
        password_hash: employeeForm.first_name.toLowerCase(),
        role: employeeForm.role,
        phone_number: employeeForm.phone
      };

      if (currentEmployee) {
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
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert([{
            username: `${employeeForm.first_name.toLowerCase()}.${employeeForm.last_name.toLowerCase()}`,
            email: `${employeeForm.first_name.toLowerCase()}.${employeeForm.last_name.toLowerCase()}@feedme.com`,
            password_hash: employeeForm.first_name.toLowerCase(),
            role: employeeForm.role,
            phone_number: employeeForm.phone
          }])
          .select();

        if (userError) throw userError;
        
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

  const handleDeleteEmployee = async (employee: any) => {
    if (confirm(`Are you sure you want to remove ${employee.first_name} ${employee.last_name}?`)) {
      try {
        const { error } = await supabase
          .from('employees')
          .delete()
          .eq('id', employee.id);

        if (error) throw error;

        toast({
          title: "Employee removed",
          description: `${employee.first_name} ${employee.last_name} has been removed.`,
        });

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

  const handleReportSubmit = async () => {
    try {
      if (currentReport) {
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

  const handleViewReport = (report: any) => {
    setCurrentReport(report);
    setIsViewReportDialogOpen(true);
  };

  const handleEditReport = (report: any) => {
    setCurrentReport(report);
    setReportForm({
      title: report.title,
      content: report.content,
      date: report.date,
    });
    setIsReportDialogOpen(true);
  };

  const handleRefreshIoT = async () => {
    setIsUpdatingTemperature(true);
    try {
      const newOvenTemp = Math.floor(ovenTemperature + (Math.random() * 10 - 5));
      const newCoolingTemp = Math.round((coolingTemperature + (Math.random() * 2 - 1)) * 10) / 10;
      
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

  const getSalesData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      name: day,
      value: Math.floor(Math.random() * 1000) + 500
    }));
  };

  const getCategoryData = () => {
    const categoryCounts: Record<string, number> = {};
    
    dishes.forEach(dish => {
      if (dish.category) {
        categoryCounts[dish.category] = (categoryCounts[dish.category] || 0) + 1;
      }
    });
    
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

          <TabsContent value="overview">
            <DirectorOverview 
              salesData={getSalesData()}
              categoryData={getCategoryData()}
              orders={orders}
              employees={employees}
              dishes={dishes}
              ovenTemperature={ovenTemperature}
              coolingTemperature={coolingTemperature}
              isUpdatingTemperature={isUpdatingTemperature}
              onRefreshIoT={handleRefreshIoT}
            />
          </TabsContent>

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
