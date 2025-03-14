
import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { 
  Store, 
  PenLine, 
  Trash2, 
  Plus, 
  PersonStanding, 
  Landmark,
  DollarSign
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RestaurantForm from "@/components/forms/RestaurantForm";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Mock data
const restaurantData = [
  { 
    id: 1, 
    name: "FeedMe Downtown", 
    address: "123 Main St, Downtown",
    director: "John Smith",
    employees: 24,
    monthlyRevenue: 125000,
    status: "open" 
  },
  { 
    id: 2, 
    name: "FeedMe Riverside", 
    address: "456 River Ave, Riverside",
    director: "Emma Jones",
    employees: 19,
    monthlyRevenue: 98000,
    status: "open" 
  },
  { 
    id: 3, 
    name: "FeedMe Central Park", 
    address: "789 Park Blvd, Central District",
    director: "Robert Wilson",
    employees: 22,
    monthlyRevenue: 110000,
    status: "closed" 
  },
  { 
    id: 4, 
    name: "FeedMe Business District", 
    address: "321 Commerce St, Business District",
    director: "Sarah Miller",
    employees: 28,
    monthlyRevenue: 145000,
    status: "open" 
  },
  { 
    id: 5, 
    name: "FeedMe Harbor View", 
    address: "654 Harbor Dr, Waterfront",
    director: "Michael Brown",
    employees: 20,
    monthlyRevenue: 105000,
    status: "closed" 
  },
];

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState(restaurantData);
  const [isAddRestaurantOpen, setIsAddRestaurantOpen] = useState(false);
  const [currency, setCurrency] = useState("DZD");
  
  const filterOptions = [
    { label: "All Restaurants", value: "all" },
    { label: "Open Only", value: "open" },
    { label: "Closed Only", value: "closed" },
    { label: "By Revenue (High to Low)", value: "revenue-desc" },
    { label: "By Revenue (Low to High)", value: "revenue-asc" },
  ];

  const handleAddRestaurant = (data: any) => {
    // Create a new restaurant with the form data
    const newRestaurant = {
      id: restaurants.length + 1,
      name: data.name,
      address: data.address,
      director: "Not assigned",
      employees: 0,
      monthlyRevenue: 0,
      status: "open"
    };
    
    setRestaurants([...restaurants, newRestaurant]);
    setIsAddRestaurantOpen(false);
  };

  const formatCurrency = (value: number) => {
    switch(currency) {
      case "USD":
        return `$${value.toLocaleString()}`;
      case "EUR":
        return `€${value.toLocaleString()}`;
      default:
        return `${value.toLocaleString()} DZD`;
    }
  };

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
      header: "Address",
      accessorKey: "address",
    },
    {
      header: "Director",
      accessorKey: "director",
    },
    {
      header: "Employees",
      accessorKey: "employees",
    },
    {
      header: "Monthly Revenue",
      accessorKey: "monthlyRevenue",
      cell: (restaurant: any) => formatCurrency(restaurant.monthlyRevenue),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: () => (
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="h-8 px-2">
            <PenLine className="h-4 w-4 text-gray-500" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button size="sm" variant="outline" className="h-8 px-2 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
        <p className="mt-1 text-gray-500">
          Manage all restaurants in your chain.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Restaurants"
          value={restaurants.length}
          icon={Store}
        />
        <StatsCard
          title="Total Employees"
          value={restaurants.reduce((sum, r) => sum + r.employees, 0)}
          icon={PersonStanding}
        />
        <StatsCard
          title="Total Monthly Revenue"
          value={formatCurrency(restaurants.reduce((sum, r) => sum + r.monthlyRevenue, 0))}
          icon={Landmark}
        />
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-4">Restaurant Management</h2>
        <DataTable
          data={restaurants}
          columns={columns}
          filterOptions={filterOptions}
          actionComponent={
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Change Currency
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="end">
                  <div className="p-1">
                    <Button 
                      variant={currency === "DZD" ? "default" : "ghost"} 
                      className="w-full justify-start font-normal" 
                      onClick={() => setCurrency("DZD")}
                    >
                      DZD (Algerian Dinar)
                    </Button>
                    <Button 
                      variant={currency === "USD" ? "default" : "ghost"} 
                      className="w-full justify-start font-normal" 
                      onClick={() => setCurrency("USD")}
                    >
                      USD (US Dollar)
                    </Button>
                    <Button 
                      variant={currency === "EUR" ? "default" : "ghost"} 
                      className="w-full justify-start font-normal" 
                      onClick={() => setCurrency("EUR")}
                    >
                      EUR (Euro)
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button 
                variant="default" 
                className="bg-feedme-500 hover:bg-feedme-600"
                onClick={() => setIsAddRestaurantOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Restaurant
              </Button>
            </div>
          }
        />
      </div>

      {/* Add Restaurant Dialog */}
      <Dialog open={isAddRestaurantOpen} onOpenChange={setIsAddRestaurantOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Restaurant</DialogTitle>
          </DialogHeader>
          <RestaurantForm 
            onSubmit={handleAddRestaurant}
            onCancel={() => setIsAddRestaurantOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Restaurants;
