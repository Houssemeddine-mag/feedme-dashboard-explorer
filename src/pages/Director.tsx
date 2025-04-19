import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IoTStatusCard } from "@/components/director/IoTStatusCard";
import { Restaurant as RestaurantType } from "@/types/director";
import { Thermometer, Snowflake } from 'lucide-react';

const Director = () => {
  const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantType | null>(null);
  const [ovenTemperature, setOvenTemperature] = useState<number>(0);
  const [coolingTemperature, setCoolingTemperature] = useState<number>(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*');

        if (error) throw error;

        setRestaurants(data || []);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        toast({
          variant: "destructive",
          title: "Fetch failed",
          description: "Failed to fetch restaurants. Please try again.",
        });
      }
    };

    fetchRestaurants();
  }, [toast]);

  useEffect(() => {
    if (selectedRestaurant) {
      setOvenTemperature(selectedRestaurant.oven_temperature || 0);
      setCoolingTemperature(selectedRestaurant.cooling_chamber_temperature || 0);
    }
  }, [selectedRestaurant]);

  const handleRestaurantSelect = (restaurant: RestaurantType) => {
    setSelectedRestaurant(restaurant);
  };

  const handleTemperatureUpdate = (temp: string | null, type: 'oven' | 'cooling') => {
    if (selectedRestaurant) {
      const numericTemp = temp ? parseFloat(temp) : null;
      
      if (type === 'oven') {
        setOvenTemperature(numericTemp || 0);
      } else {
        setCoolingTemperature(numericTemp || 0);
      }
      
      updateTemperature(selectedRestaurant.id, type, numericTemp);
    }
  };

  const updateTemperature = async (restaurantId: string, type: 'oven' | 'cooling', temperature: number | null) => {
    try {
      const { error } = await supabase
        .from('restaurants')
        .update({
          [type === 'oven' ? 'oven_temperature' : 'cooling_chamber_temperature']: temperature
        })
        .eq('id', restaurantId);

      if (error) throw error;

      toast({
        title: "Temperature updated",
        description: `${type === 'oven' ? 'Oven' : 'Cooling chamber'} temperature has been updated.`,
      });
    } catch (error) {
      console.error('Error updating temperature:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update temperature. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Director Dashboard</h1>

      {/* Restaurant Selection */}
      <div className="mb-6">
        <Label htmlFor="restaurantSelect" className="block text-sm font-medium text-gray-700">
          Select Restaurant:
        </Label>
        <select
          id="restaurantSelect"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          onChange={(e) => {
            const selectedId = e.target.value;
            const restaurant = restaurants.find(r => r.id === selectedId);
            if (restaurant) {
              handleRestaurantSelect(restaurant);
            }
          }}
          defaultValue=""
        >
          <option value="" disabled>Select a restaurant</option>
          {restaurants.map((restaurant) => (
            <option key={restaurant.id} value={restaurant.id}>
              {restaurant.name}
            </option>
          ))}
        </select>
      </div>

      {/* IoT Status Cards */}
      {selectedRestaurant && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
          <IoTStatusCard
            title="Oven Temperature"
            value={ovenTemperature}
            status={ovenTemperature > 200 ? 'warning' : 'normal'}
            unit="°C"
            icon={Thermometer}
          />
          <IoTStatusCard
            title="Cooling Chamber Temperature"
            value={coolingTemperature}
            status={coolingTemperature < 0 ? 'warning' : 'normal'}
            unit="°C"
            icon={Snowflake}
          />
        </div>
      )}

      {/* Temperature Update Form */}
      {selectedRestaurant && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Update Oven Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="ovenTemp">Temperature (°C)</Label>
                <Input
                  type="number"
                  id="ovenTemp"
                  placeholder="Enter oven temperature"
                  value={ovenTemperature}
                  onChange={(e) => setOvenTemperature(parseFloat(e.target.value))}
                />
                <Button onClick={() => handleTemperatureUpdate(String(ovenTemperature), 'oven')}>
                  Update Oven
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Cooling Chamber Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="coolingTemp">Temperature (°C)</Label>
                <Input
                  type="number"
                  id="coolingTemp"
                  placeholder="Enter cooling chamber temperature"
                  value={coolingTemperature}
                  onChange={(e) => setCoolingTemperature(parseFloat(e.target.value))}
                />
                <Button onClick={() => handleTemperatureUpdate(String(coolingTemperature), 'cooling')}>
                  Update Cooling Chamber
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Director;
