
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Restaurant {
  id: number;
  name: string;
  status: string;
  sales: number;
  director: string;
  email: string;
  staffCount: number;
  alertLevel: "none" | "low" | "medium" | "high";
}

interface RestaurantTableProps {
  restaurants: Restaurant[];
  filterValue: string;
  setFilterValue: (value: string) => void;
}

export const RestaurantTable = ({ 
  restaurants, 
  filterValue, 
  setFilterValue 
}: RestaurantTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
            className={alertClasses[restaurant.alertLevel]}
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
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 px-2"
            onClick={() => {
              toast({
                title: "Viewing stats",
                description: `Viewing statistics for ${restaurant.name}`,
              });
            }}
          >
            <BarChart3 className="h-4 w-4 text-gray-500" />
            <span className="sr-only">View Stats</span>
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 px-2"
            onClick={() => {
              toast({
                title: "Viewing report",
                description: `Viewing report for ${restaurant.name}`,
              });
            }}
          >
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="sr-only">View Report</span>
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 px-2"
            onClick={() => {
              toast({
                title: "Email sent",
                description: `Email dialog opened for ${restaurant.director} at ${restaurant.name}`,
              });
              navigate(`/emails?recipient=${encodeURIComponent(restaurant.email)}`);
            }}
          >
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="sr-only">Email Director</span>
          </Button>
        </div>
      ),
    },
  ];
  
  // Filter data based on the selected filter
  const filteredData = restaurants.filter(restaurant => {
    if (filterValue === "all") return true;
    return restaurant.status === filterValue;
  });

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Restaurant Status</h2>
      <DataTable
        data={filteredData}
        columns={columns}
        filterOptions={filterOptions}
        onFilterChange={setFilterValue}
      />
    </div>
  );
};
