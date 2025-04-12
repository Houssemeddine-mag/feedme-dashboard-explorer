
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Clock, AlertCircle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import FeedMeLogo from "@/components/FeedMeLogo";

interface OrderItem {
  id: string;
  dish_name: string;
  quantity: number;
  status: string;
  created_at: string;
}

interface Order {
  id: string;
  table_number: number;
  customer_name: string;
  status: string;
  created_at: string;
  items: OrderItem[];
}

const statusColors = {
  not_ready: "bg-gray-200",
  in_progress: "bg-amber-200",
  ready: "bg-green-200",
};

const ChefPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // For demo purposes, let's add some mock orders
  useEffect(() => {
    const mockOrders = [
      {
        id: "1",
        table_number: 5,
        customer_name: "John Smith",
        status: "pending",
        created_at: new Date(Date.now() - 15 * 60000).toISOString(),
        items: [
          {
            id: "item1",
            dish_name: "Margherita Pizza",
            quantity: 1,
            status: "not_ready",
            created_at: new Date(Date.now() - 15 * 60000).toISOString(),
          },
          {
            id: "item2",
            dish_name: "Caesar Salad",
            quantity: 2,
            status: "not_ready",
            created_at: new Date(Date.now() - 15 * 60000).toISOString(),
          },
        ],
      },
      {
        id: "2",
        table_number: 3,
        customer_name: "Emma Johnson",
        status: "pending",
        created_at: new Date(Date.now() - 5 * 60000).toISOString(),
        items: [
          {
            id: "item3",
            dish_name: "Beef Burger",
            quantity: 1,
            status: "not_ready",
            created_at: new Date(Date.now() - 5 * 60000).toISOString(),
          },
          {
            id: "item4",
            dish_name: "Carbonara Pasta",
            quantity: 1,
            status: "not_ready",
            created_at: new Date(Date.now() - 5 * 60000).toISOString(),
          },
        ],
      },
      {
        id: "3",
        table_number: 8,
        customer_name: "Alex Brown",
        status: "pending",
        created_at: new Date(Date.now() - 2 * 60000).toISOString(),
        items: [
          {
            id: "item5",
            dish_name: "Tiramisu",
            quantity: 2,
            status: "not_ready",
            created_at: new Date(Date.now() - 2 * 60000).toISOString(),
          },
        ],
      },
    ];

    setOrders(mockOrders);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    // For demo, just navigate back to login
    navigate("/login");
    toast({
      title: "Logged out successfully",
    });
  };

  const updateItemStatus = (orderId: string, itemId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          const updatedItems = order.items.map((item) => {
            if (item.id === itemId) {
              return { ...item, status: newStatus };
            }
            return item;
          });
          
          // Calculate overall order status
          const allReady = updatedItems.every((item) => item.status === "ready");
          
          return {
            ...order,
            items: updatedItems,
            status: allReady ? "ready" : "pending",
          };
        }
        return order;
      })
    );

    toast({
      title: `Item status updated to ${newStatus}`,
    });
  };

  const removeOrder = (orderId: string) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    toast({
      title: "Order completed",
      description: "The order has been marked as served",
    });
  };

  const refuseOrder = (orderId: string) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    toast({
      title: "Order refused",
      description: "The order has been refused and removed from the queue",
      variant: "destructive",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const minutes = Math.floor(
      (Date.now() - new Date(dateString).getTime()) / 60000
    );
    return minutes < 1 ? "Just now" : `${minutes} min ago`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 text-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 mr-3 text-feedme-500" />
              <div>
                <h1 className="text-xl font-bold">Kitchen Dashboard</h1>
                <p className="text-sm text-gray-400">Manage orders in real-time</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-right">
                <div className="font-medium">Chef Mode</div>
                <div className="text-gray-400">Welcome, Chef</div>
              </div>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Active Orders</h2>
          <div className="flex items-center space-x-2">
            <Badge className="bg-gray-200 text-gray-800">Not Ready</Badge>
            <Badge className="bg-amber-200 text-amber-800">In Progress</Badge>
            <Badge className="bg-green-200 text-green-800">Ready to Serve</Badge>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-feedme-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center">
                            Table {order.table_number}
                            {order.status === "ready" && (
                              <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
                            )}
                          </CardTitle>
                          <div className="text-sm text-gray-500">
                            {order.customer_name}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {getTimeAgo(order.created_at)}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="mt-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className={`mb-3 p-3 rounded-md ${statusColors[item.status as keyof typeof statusColors]}`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">{item.dish_name}</div>
                                <div className="text-sm">Qty: {item.quantity}</div>
                              </div>
                              <div className="flex">
                                <div className="flex space-x-1">
                                  <Button
                                    size="sm"
                                    variant={item.status === "not_ready" ? "default" : "outline"}
                                    onClick={() => updateItemStatus(order.id, item.id, "in_progress")}
                                    disabled={item.status === "ready"}
                                  >
                                    Start
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={item.status === "ready" ? "default" : "outline"}
                                    onClick={() => updateItemStatus(order.id, item.id, "ready")}
                                    disabled={item.status === "not_ready"}
                                  >
                                    Ready
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => refuseOrder(order.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Refuse Order
                      </Button>
                      
                      <Button
                        size="sm"
                        disabled={order.status !== "ready"}
                        className={order.status === "ready" ? "bg-green-600 hover:bg-green-700" : ""}
                        onClick={() => removeOrder(order.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {order.status === "ready" ? "Serve" : "Not Ready"}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {orders.length === 0 && !loading && (
          <div className="text-center py-10">
            <div className="flex justify-center">
              <ChefHat className="h-16 w-16 text-gray-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-800">
              No Active Orders
            </h3>
            <p className="mt-2 text-gray-500">
              New orders will appear here once they're placed.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChefPage;
