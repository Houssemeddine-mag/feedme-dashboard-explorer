
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  ChefHat,
  FileText,
  UsersRound,
  LogOut,
  Search,
  Plus,
  Check,
  Clock,
  AlertCircle,
  Utensils,
  DollarSign,
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
import { useToast } from "@/components/ui/use-toast";
import FeedMeLogo from "@/components/FeedMeLogo";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

// Mock data
const mockDishes = [
  { id: 1, name: "Margherita Pizza", category: "Pizza", price: 12.99, image: "/placeholder.svg" },
  { id: 2, name: "Carbonara Pasta", category: "Pasta", price: 14.99, image: "/placeholder.svg" },
  { id: 3, name: "Caesar Salad", category: "Salad", price: 8.99, image: "/placeholder.svg" },
  { id: 4, name: "Beef Burger", category: "Burgers", price: 15.99, image: "/placeholder.svg" },
  { id: 5, name: "Tiramisu", category: "Dessert", price: 7.99, image: "/placeholder.svg" },
  { id: 6, name: "Chicken Wings", category: "Appetizers", price: 9.99, image: "/placeholder.svg" },
  { id: 7, name: "Veggie Burger", category: "Burgers", price: 13.99, image: "/placeholder.svg" },
  { id: 8, name: "Chocolate Cake", category: "Dessert", price: 6.99, image: "/placeholder.svg" },
];

// Cashier page
const CashierPage = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentOrder, setCurrentOrder] = useState<any[]>([]);
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Filter dishes based on search term
  const filteredDishes = mockDishes.filter(dish => 
    dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dish.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group dishes by category
  const categorizedDishes = filteredDishes.reduce((acc, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = [];
    }
    acc[dish.category].push(dish);
    return acc;
  }, {} as Record<string, typeof mockDishes>);

  // Add dish to current order
  const addToOrder = (dish: any) => {
    const existingItem = currentOrder.find(item => item.id === dish.id);
    
    if (existingItem) {
      setCurrentOrder(currentOrder.map(item => 
        item.id === dish.id 
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price } 
          : item
      ));
    } else {
      setCurrentOrder([
        ...currentOrder, 
        { ...dish, quantity: 1, subtotal: dish.price }
      ]);
    }
    
    toast({
      title: "Added to order",
      description: `${dish.name} added to the current order.`,
    });
  };

  // Remove dish from current order
  const removeFromOrder = (dishId: number) => {
    const existingItem = currentOrder.find(item => item.id === dishId);
    
    if (existingItem && existingItem.quantity > 1) {
      setCurrentOrder(currentOrder.map(item => 
        item.id === dishId 
          ? { ...item, quantity: item.quantity - 1, subtotal: (item.quantity - 1) * item.price } 
          : item
      ));
    } else {
      setCurrentOrder(currentOrder.filter(item => item.id !== dishId));
    }
  };

  // Calculate total order amount
  const orderTotal = currentOrder.reduce((total, item) => total + item.subtotal, 0);

  // Process order submission
  const submitOrder = async () => {
    if (currentOrder.length === 0) {
      toast({
        variant: "destructive",
        title: "Order is empty",
        description: "Please add items to the order before submitting.",
      });
      return;
    }

    if (!tableNumber) {
      toast({
        variant: "destructive",
        title: "Table number required",
        description: "Please enter a table number for this order.",
      });
      return;
    }

    // Create a new order with a unique ID and timestamp
    const newOrder = {
      id: Date.now(),
      table: tableNumber,
      customerName: customerName || "Guest",
      items: [...currentOrder],
      status: "pending",
      total: orderTotal,
      timestamp: new Date().toISOString(),
    };

    // In a real app, this would send the order to the database
    // For now, we'll just add it to our local state
    setOrders([newOrder, ...orders]);
    
    toast({
      title: "Order submitted",
      description: `Order for table ${tableNumber} has been sent to the kitchen.`,
    });
    
    // Reset the current order
    setCurrentOrder([]);
    setTableNumber("");
    setCustomerName("");
    setIsCheckoutOpen(false);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Logout failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Please try again later.",
      });
    }
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
                <h1 className="text-xl font-bold">HoussemHouse</h1>
                <p className="text-sm text-gray-500">Cashier Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-right">
                <div className="font-medium">Cashier Dashboard</div>
                <div className="text-gray-500">Welcome, Cashier</div>
              </div>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs
          defaultValue="orders"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <TabsList className="grid grid-cols-3 w-[400px]">
              <TabsTrigger value="orders">New Order</TabsTrigger>
              <TabsTrigger value="active">Active Orders</TabsTrigger>
              <TabsTrigger value="history">Order History</TabsTrigger>
            </TabsList>
            
            {currentOrder.length > 0 && (
              <Button 
                className="bg-feedme-500 hover:bg-feedme-600"
                onClick={() => setIsCheckoutOpen(true)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Checkout ({currentOrder.length} items)
              </Button>
            )}
          </div>

          {/* New Order Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center mb-6">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="space-y-6">
              {Object.entries(categorizedDishes).map(([category, dishes]) => (
                <div key={category}>
                  <h3 className="text-lg font-medium mb-3">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dishes.map((dish) => (
                      <Card key={dish.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-40 bg-gray-100 flex items-center justify-center">
                          <img src={dish.image} alt={dish.name} className="h-full object-cover" />
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{dish.name}</h4>
                            <span className="font-bold">${dish.price.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900">
                              {dish.category}
                            </Badge>
                            <Button size="sm" onClick={() => addToOrder(dish)}>
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {Object.keys(categorizedDishes).length === 0 && (
              <div className="text-center py-10">
                <Utensils className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No dishes found</h3>
                <p className="text-gray-500">Try a different search term</p>
              </div>
            )}
          </TabsContent>

          {/* Active Orders Tab */}
          <TabsContent value="active" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders
                .filter(order => order.status === "pending" || order.status === "in-progress")
                .map(order => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-feedme-50 pb-2">
                      <CardTitle className="flex justify-between items-center">
                        <span>Table {order.table}</span>
                        <Badge 
                          className={order.status === "pending" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-blue-100 text-blue-800"}
                        >
                          {order.status === "pending" ? "Pending" : "In Progress"}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {order.customerName} • {new Date(order.timestamp).toLocaleTimeString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-2 mb-3">
                        {order.items.map((item: any, index: number) => (
                          <li key={index} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span>${item.subtotal.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t pt-2 flex justify-between font-medium">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {orders.filter(order => order.status === "pending" || order.status === "in-progress").length === 0 && (
                <div className="col-span-full text-center py-10">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No active orders</h3>
                  <p className="text-gray-500">All orders have been completed</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Order History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="bg-white rounded-md border">
              <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b">
                <div>Order ID</div>
                <div>Table</div>
                <div>Customer</div>
                <div>Items</div>
                <div>Total</div>
                <div>Status</div>
              </div>
              {orders
                .filter(order => order.status === "completed")
                .map(order => (
                  <div key={order.id} className="grid grid-cols-6 gap-4 p-4 border-b items-center">
                    <div className="font-mono text-sm">#{order.id.toString().slice(-6)}</div>
                    <div>Table {order.table}</div>
                    <div>{order.customerName}</div>
                    <div>{order.items.reduce((total: number, item: any) => total + item.quantity, 0)} items</div>
                    <div>${order.total.toFixed(2)}</div>
                    <div>
                      <Badge className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    </div>
                  </div>
                ))}

              {orders.filter(order => order.status === "completed").length === 0 && (
                <div className="text-center py-10">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No order history</h3>
                  <p className="text-gray-500">Completed orders will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Current Order / Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Current Order</DialogTitle>
            <DialogDescription>
              Review order details before submitting.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Table Number</Label>
              <Input 
                type="number" 
                placeholder="Table number" 
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Customer Name (Optional)</Label>
              <Input 
                placeholder="Customer name" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 p-3 border-b font-medium">
                Order Items
              </div>
              <div className="p-3 space-y-3 max-h-60 overflow-y-auto">
                {currentOrder.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        ${item.price.toFixed(2)} x {item.quantity}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="font-medium">${item.subtotal.toFixed(2)}</div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0" 
                        onClick={() => removeFromOrder(item.id)}
                      >
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {currentOrder.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No items in order
                  </div>
                )}
              </div>
              <div className="p-3 border-t bg-gray-50 flex justify-between font-medium">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex space-x-2 sm:space-x-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCheckoutOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-feedme-500 hover:bg-feedme-600"
              onClick={submitOrder}
              disabled={currentOrder.length === 0 || !tableNumber}
            >
              <Check className="h-4 w-4 mr-2" />
              Submit Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper component for label
const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-sm font-medium text-gray-700">{children}</label>
);

export default CashierPage;
