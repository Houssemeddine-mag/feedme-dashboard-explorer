
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Utensils,
  Clock,
  Calendar,
  LogOut,
  Search,
  ShoppingCart,
  PlusCircle,
  MinusCircle,
  X,
  Check,
  User,
  MapPin,
  Phone,
  ChevronRight,
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import FeedMeLogo from "@/components/FeedMeLogo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

// Mock data for menu items
const menuItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
    price: 12.99,
    category: "Pizza",
    image: "/placeholder.svg",
    popular: true,
  },
  {
    id: 2,
    name: "Carbonara Pasta",
    description: "Creamy pasta with eggs, cheese, pancetta, and black pepper",
    price: 14.99,
    category: "Pasta",
    image: "/placeholder.svg",
    popular: true,
  },
  {
    id: 3,
    name: "Caesar Salad",
    description: "Romaine lettuce, croutons, parmesan cheese with Caesar dressing",
    price: 8.99,
    category: "Salad",
    image: "/placeholder.svg",
    popular: false,
  },
  {
    id: 4,
    name: "Beef Burger",
    description: "Juicy beef patty with lettuce, tomato, onion, and special sauce",
    price: 15.99,
    category: "Burgers",
    image: "/placeholder.svg",
    popular: true,
  },
  {
    id: 5,
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream",
    price: 7.99,
    category: "Dessert",
    image: "/placeholder.svg",
    popular: false,
  },
  {
    id: 6,
    name: "Chicken Wings",
    description: "Crispy wings tossed in spicy buffalo sauce",
    price: 9.99,
    category: "Appetizers",
    image: "/placeholder.svg",
    popular: true,
  },
  {
    id: 7,
    name: "Veggie Burger",
    description: "Plant-based patty with avocado, lettuce, and chipotle mayo",
    price: 13.99,
    category: "Burgers",
    image: "/placeholder.svg",
    popular: false,
  },
  {
    id: 8,
    name: "Chocolate Cake",
    description: "Rich chocolate cake with ganache frosting",
    price: 6.99,
    category: "Dessert",
    image: "/placeholder.svg",
    popular: false,
  },
];

// Mock order data
const mockOrders = [
  {
    id: "ORD-7245",
    date: "2025-04-11",
    status: "completed",
    items: [
      { id: 1, name: "Margherita Pizza", quantity: 1, price: 12.99 },
      { id: 6, name: "Chicken Wings", quantity: 1, price: 9.99 },
    ],
    total: 22.98,
  },
  {
    id: "ORD-7244",
    date: "2025-04-12",
    status: "in-progress",
    items: [
      { id: 4, name: "Beef Burger", quantity: 2, price: 15.99 },
      { id: 5, name: "Tiramisu", quantity: 1, price: 7.99 },
    ],
    total: 39.97,
  },
];

// Mock reservation data
const mockReservations = [
  {
    id: "RES-3245",
    date: "2025-04-15",
    time: "19:00",
    guests: 4,
    status: "confirmed",
  },
  {
    id: "RES-3244",
    date: "2025-04-20",
    time: "20:30",
    guests: 2,
    status: "pending",
  },
];

const CustomerPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("menu");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState("2");
  const [orders, setOrders] = useState(mockOrders);
  const [reservations, setReservations] = useState(mockReservations);
  
  // Filter menu items
  const filteredMenuItems = menuItems.filter(item => {
    // Filter by search term
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories
  const categories = ["all", ...new Set(menuItems.map(item => item.category))];
  
  // Add item to cart
  const addToCart = (item: any) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    toast({
      title: "Added to cart",
      description: `${item.name} added to your cart.`,
    });
  };
  
  // Remove item from cart
  const removeFromCart = (id: number) => {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(item => 
        item.id === id 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== id));
    }
  };
  
  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => 
    total + (item.price * item.quantity), 0
  );
  
  // Submit order
  const placeOrder = () => {
    if (cart.length === 0) return;
    
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      status: "pending",
      items: [...cart],
      total: cartTotal,
    };
    
    setOrders([newOrder, ...orders]);
    setCart([]);
    setIsCartOpen(false);
    
    toast({
      title: "Order placed successfully",
      description: `Your order #${newOrder.id} has been received.`,
    });
    
    // Automatically navigate to orders tab
    setActiveTab("orders");
  };
  
  // Make reservation
  const makeReservation = () => {
    if (!date || !time || !guests) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide all reservation details.",
      });
      return;
    }
    
    const newReservation = {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      date: date.toISOString().split('T')[0],
      time,
      guests: parseInt(guests),
      status: "pending",
    };
    
    setReservations([newReservation, ...reservations]);
    setIsReservationOpen(false);
    
    toast({
      title: "Reservation requested",
      description: `Your reservation for ${format(date, 'PPP')} at ${time} has been submitted.`,
    });
    
    // Reset form
    setDate(undefined);
    setTime("19:00");
    setGuests("2");
    
    // Navigate to reservations tab
    setActiveTab("reservations");
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <FeedMeLogo className="w-32" />
              </Link>
              <h1 className="text-xl font-bold hidden sm:block">HoussemHouse</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-feedme-500">
                    {cart.length}
                  </Badge>
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex-1 container mx-auto px-4 py-6"
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="menu">
            <Utensils className="h-4 w-4 mr-2" />
            Menu
          </TabsTrigger>
          <TabsTrigger value="orders">
            <Clock className="h-4 w-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="reservations">
            <Calendar className="h-4 w-4 mr-2" />
            Reservations
          </TabsTrigger>
        </TabsList>
        
        {/* Menu Tab */}
        <TabsContent value="menu" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input 
                placeholder="Search menu..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex overflow-x-auto pb-2 md:pb-0 max-w-full gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filterCategory === category ? "default" : "outline"}
                  className={filterCategory === category ? "bg-feedme-500" : ""}
                  size="sm"
                  onClick={() => setFilterCategory(category)}
                >
                  {category === "all" ? "All" : category}
                </Button>
              ))}
            </div>
          </div>
          
          {activeTab === "menu" && filterCategory === "all" && searchTerm === "" && (
            <div className="space-y-1">
              <h2 className="text-lg font-medium">Most Popular</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems
                  .filter(item => item.popular)
                  .map(item => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="h-40 bg-gray-100">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between mb-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <span className="font-bold">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{item.description}</p>
                        <Button 
                          className="w-full bg-feedme-500 hover:bg-feedme-600"
                          onClick={() => addToCart(item)}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              <Separator className="my-6" />
            </div>
          )}
          
          <div className="space-y-1">
            <h2 className="text-lg font-medium">Menu Items</h2>
            {filteredMenuItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMenuItems.map(item => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="h-40 bg-gray-100">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <span className="font-bold">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{item.description}</p>
                      <Button 
                        className="w-full bg-feedme-500 hover:bg-feedme-600"
                        onClick={() => addToCart(item)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Utensils className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">No menu items found</h3>
                <p className="text-gray-500">Try a different search or category</p>
              </div>
            )}
          </div>
          
          <div className="fixed bottom-6 right-6 md:hidden">
            <Button 
              className="h-14 w-14 rounded-full shadow-lg bg-feedme-500 hover:bg-feedme-600"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-white text-feedme-500">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </div>
        </TabsContent>
        
        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Your Orders</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveTab("menu")}
            >
              <Utensils className="h-4 w-4 mr-2" />
              Menu
            </Button>
          </div>
          
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map(order => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{order.id}</CardTitle>
                      <Badge 
                        className={
                          order.status === "pending" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : order.status === "in-progress" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-green-100 text-green-800"
                        }
                      >
                        {order.status === "pending" 
                          ? "Pending" 
                          : order.status === "in-progress" 
                            ? "In Progress" 
                            : "Completed"}
                      </Badge>
                    </div>
                    <CardDescription>
                      Ordered on {new Date(order.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 p-3">
                    <div className="w-full flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {order.status === "pending" 
                          ? "Preparing" 
                          : order.status === "in-progress" 
                            ? "Cooking" 
                            : "Delivered"}
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">No orders yet</h3>
              <p className="text-gray-500 mb-4">When you place an order, it will appear here</p>
              <Button 
                className="bg-feedme-500 hover:bg-feedme-600"
                onClick={() => setActiveTab("menu")}
              >
                <Utensils className="h-4 w-4 mr-2" />
                Browse Menu
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Reservations Tab */}
        <TabsContent value="reservations" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Your Reservations</h2>
            <Button 
              className="bg-feedme-500 hover:bg-feedme-600"
              onClick={() => setIsReservationOpen(true)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              New Reservation
            </Button>
          </div>
          
          {reservations.length > 0 ? (
            <div className="space-y-4">
              {reservations.map(reservation => (
                <Card key={reservation.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{reservation.id}</CardTitle>
                      <Badge 
                        className={
                          reservation.status === "pending" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {reservation.status === "pending" ? "Pending" : "Confirmed"}
                      </Badge>
                    </div>
                    <CardDescription>
                      Table for {reservation.guests} {reservation.guests === 1 ? "person" : "people"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Date</div>
                        <div className="font-medium">{new Date(reservation.date).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Time</div>
                        <div className="font-medium">{reservation.time}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 p-3">
                    <div className="w-full flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">No reservations yet</h3>
              <p className="text-gray-500 mb-4">Book a table for your next visit</p>
              <Button 
                className="bg-feedme-500 hover:bg-feedme-600"
                onClick={() => setIsReservationOpen(true)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Make Reservation
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Cart Dialog */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Cart</DialogTitle>
            <DialogDescription>
              Review your items before placing an order.
            </DialogDescription>
          </DialogHeader>
          
          {cart.length > 0 ? (
            <>
              <div className="space-y-4 my-4 max-h-[50vh] overflow-y-auto pr-2">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">${item.price.toFixed(2)} each</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7" 
                        onClick={() => removeFromCart(item.id)}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7" 
                        onClick={() => addToCart(item)}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between items-center py-2 font-medium">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                  Continue Shopping
                </Button>
                <Button 
                  className="bg-feedme-500 hover:bg-feedme-600"
                  onClick={placeOrder}
                >
                  Place Order
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">Your cart is empty</h3>
              <p className="text-gray-500 mb-4">Add items from the menu to get started</p>
              <Button 
                className="bg-feedme-500 hover:bg-feedme-600"
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveTab("menu");
                }}
              >
                Browse Menu
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Reservation Dialog */}
      <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book a Table</DialogTitle>
            <DialogDescription>
              Make a reservation at HoussemHouse restaurant.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    {date ? (
                      format(date, "PPP")
                    ) : (
                      <span className="text-gray-500">Select a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => {
                      // Disable dates in the past
                      return date < new Date(new Date().setHours(0, 0, 0, 0));
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="17:00">5:00 PM</option>
                <option value="17:30">5:30 PM</option>
                <option value="18:00">6:00 PM</option>
                <option value="18:30">6:30 PM</option>
                <option value="19:00">7:00 PM</option>
                <option value="19:30">7:30 PM</option>
                <option value="20:00">8:00 PM</option>
                <option value="20:30">8:30 PM</option>
                <option value="21:00">9:00 PM</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Guests</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              >
                <option value="1">1 person</option>
                <option value="2">2 people</option>
                <option value="3">3 people</option>
                <option value="4">4 people</option>
                <option value="5">5 people</option>
                <option value="6">6 people</option>
                <option value="7">7 people</option>
                <option value="8">8 people</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Special Requests (Optional)</label>
              <Input placeholder="Any special requests or preferences?" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReservationOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-feedme-500 hover:bg-feedme-600"
              onClick={makeReservation}
              disabled={!date}
            >
              <Check className="h-4 w-4 mr-2" />
              Reserve Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerPage;
