
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { DirectorOverview } from "@/components/director/DirectorOverview";
import { Restaurant as RestaurantType } from "@/types/director";
import { MainLayout } from "@/components/layout";

const Director = () => {
  const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantType | null>(null);
  const [ovenTemperature, setOvenTemperature] = useState<number>(0);
  const [coolingTemperature, setCoolingTemperature] = useState<number>(0);
  const [isUpdatingTemperature, setIsUpdatingTemperature] = useState(false);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [dishes, setDishes] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRestaurants();
    fetchMockData();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*');

      if (error) throw error;

      setRestaurants(data || []);
      if (data && data.length > 0) {
        setSelectedRestaurant(data[0]);
        setOvenTemperature(data[0].oven_temperature || 180);
        setCoolingTemperature(data[0].cooling_chamber_temperature || -5);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast({
        variant: "destructive",
        title: "Fetch failed",
        description: "Failed to fetch restaurants. Please try again.",
      });
    }
  };

  const fetchMockData = () => {
    // Mock sales data
    setSalesData([
      { name: 'Mon', value: 4000 },
      { name: 'Tue', value: 3000 },
      { name: 'Wed', value: 5000 },
      { name: 'Thu', value: 2780 },
      { name: 'Fri', value: 1890 },
      { name: 'Sat', value: 6390 },
      { name: 'Sun', value: 3490 },
    ]);

    // Mock category data
    setCategoryData([
      { name: 'Main Course', value: 12 },
      { name: 'Appetizer', value: 8 },
      { name: 'Dessert', value: 5 },
      { name: 'Drinks', value: 7 },
    ]);

    // Mock orders
    setOrders([
      { id: '1', table_number: 3, total_amount: 45.99, status: 'Completed', created_at: new Date().toISOString() },
      { id: '2', table_number: 5, total_amount: 32.50, status: 'In Progress', created_at: new Date().toISOString() },
      { id: '3', table_number: 2, total_amount: 28.75, status: 'New', created_at: new Date().toISOString() },
    ]);

    // Mock employees
    setEmployees([
      { id: '1', first_name: 'John', last_name: 'Doe', role: 'Chef', hire_date: '2022-01-15' },
      { id: '2', first_name: 'Jane', last_name: 'Smith', role: 'Server', hire_date: '2022-03-10' },
      { id: '3', first_name: 'Mike', last_name: 'Johnson', role: 'Cashier', hire_date: '2022-02-22' },
    ]);

    // Mock dishes
    setDishes([
      { id: '1', name: 'Pasta Carbonara', category: 'Main Course', price: 14.99 },
      { id: '2', name: 'Caesar Salad', category: 'Appetizer', price: 9.99 },
      { id: '3', name: 'Chocolate Cake', category: 'Dessert', price: 7.99 },
    ]);
  };

  const handleRestaurantSelect = (restaurantId: string) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (restaurant) {
      setSelectedRestaurant(restaurant);
      setOvenTemperature(restaurant.oven_temperature || 180);
      setCoolingTemperature(restaurant.cooling_chamber_temperature || -5);
    }
  };

  const handleRefreshIoT = async () => {
    if (!selectedRestaurant) return;

    setIsUpdatingTemperature(true);
    
    try {
      // Simulate fetching updated IoT data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate random temperatures within reasonable ranges
      const newOvenTemp = Math.floor(Math.random() * (200 - 160 + 1)) + 160;
      const newCoolingTemp = Math.floor(Math.random() * (-2 - (-8) + 1)) + (-8);
      
      setOvenTemperature(newOvenTemp);
      setCoolingTemperature(newCoolingTemp);
      
      // Update in database
      const { error } = await supabase
        .from('restaurants')
        .update({
          oven_temperature: newOvenTemp,
          cooling_chamber_temperature: newCoolingTemp
        })
        .eq('id', selectedRestaurant.id);

      if (error) throw error;
      
      toast({
        title: "IoT data refreshed",
        description: "Temperature readings have been updated.",
      });
    } catch (error) {
      console.error('Error updating temperatures:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to refresh IoT data. Please try again.",
      });
    } finally {
      setIsUpdatingTemperature(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4 max-w-full">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Director Dashboard</h1>
          
          {restaurants.length > 0 && (
            <div className="w-full md:w-64 mt-4 md:mt-0">
              <select
                className="w-full p-2 border rounded-md"
                onChange={(e) => handleRestaurantSelect(e.target.value)}
                value={selectedRestaurant?.id || ''}
              >
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {selectedRestaurant ? (
          <DirectorOverview
            salesData={salesData}
            categoryData={categoryData}
            orders={orders}
            employees={employees}
            dishes={dishes}
            ovenTemperature={ovenTemperature}
            coolingTemperature={coolingTemperature}
            isUpdatingTemperature={isUpdatingTemperature}
            onRefreshIoT={handleRefreshIoT}
          />
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl">No restaurant selected</h3>
            <p className="text-gray-500 mt-2">Please select a restaurant to view the dashboard.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Director;
