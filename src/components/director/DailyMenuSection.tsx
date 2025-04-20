
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Save, Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Dish } from "@/types/director";

interface DailyMenuSectionProps {
  restaurantId: string;
}

interface DailyMenu {
  id: string;
  date: string;
  restaurant_id: string;
}

interface MenuItem {
  id?: string;
  dish_id: string;
  quantity: number;
  dish?: Dish;
}

export const DailyMenuSection = ({ restaurantId }: DailyMenuSectionProps) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [dailyMenu, setDailyMenu] = useState<DailyMenu | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDishes();
    fetchDailyMenu();
  }, [restaurantId, selectedDate]);

  const fetchDishes = async () => {
    try {
      const { data, error } = await supabase
        .from('dishes')
        .select('*');

      if (error) throw error;
      setDishes(data || []);
    } catch (error) {
      console.error('Error fetching dishes:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch dishes. Please try again."
      });
    }
  };

  const fetchDailyMenu = async () => {
    setIsLoading(true);
    try {
      // First, find if there's a daily menu for the selected date and restaurant
      const { data: menuData, error: menuError } = await supabase
        .from('daily_menus')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('date', selectedDate)
        .single();

      if (menuError && menuError.code !== 'PGRST116') {
        throw menuError;
      }

      if (menuData) {
        setDailyMenu(menuData);
        
        // Fetch menu items
        const { data: itemsData, error: itemsError } = await supabase
          .from('daily_menu_items')
          .select(`
            id,
            dish_id,
            quantity,
            dish:dishes(id, name, category, price)
          `)
          .eq('daily_menu_id', menuData.id);

        if (itemsError) throw itemsError;
        
        setMenuItems(itemsData || []);
      } else {
        setDailyMenu(null);
        setMenuItems([]);
      }
    } catch (error) {
      console.error('Error fetching daily menu:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch daily menu. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMenuItem = () => {
    if (dishes.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No dishes available to add. Please create dishes first."
      });
      return;
    }

    setMenuItems([
      ...menuItems,
      { dish_id: dishes[0].id, quantity: 1, dish: dishes[0] }
    ]);
  };

  const handleRemoveMenuItem = (index: number) => {
    const newItems = [...menuItems];
    newItems.splice(index, 1);
    setMenuItems(newItems);
  };

  const handleDishChange = (index: number, dishId: string) => {
    const selectedDish = dishes.find(d => d.id === dishId);
    const newItems = [...menuItems];
    newItems[index] = {
      ...newItems[index],
      dish_id: dishId,
      dish: selectedDish
    };
    setMenuItems(newItems);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...menuItems];
    newItems[index] = {
      ...newItems[index],
      quantity: quantity
    };
    setMenuItems(newItems);
  };

  const handleSaveMenu = async () => {
    if (menuItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please add at least one dish to the daily menu."
      });
      return;
    }

    setIsSaving(true);
    try {
      let menuId = dailyMenu?.id;
      
      // If we don't have a daily menu yet, create one
      if (!menuId) {
        const { data: newMenu, error: menuError } = await supabase
          .from('daily_menus')
          .insert({
            restaurant_id: restaurantId,
            date: selectedDate,
          })
          .select('id')
          .single();

        if (menuError) throw menuError;
        menuId = newMenu.id;
      } else {
        // Delete existing menu items
        const { error: deleteError } = await supabase
          .from('daily_menu_items')
          .delete()
          .eq('daily_menu_id', menuId);

        if (deleteError) throw deleteError;
      }

      // Insert new menu items
      const menuItemsToInsert = menuItems.map(item => ({
        daily_menu_id: menuId,
        dish_id: item.dish_id,
        quantity: item.quantity
      }));

      const { error: insertError } = await supabase
        .from('daily_menu_items')
        .insert(menuItemsToInsert);

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Daily menu has been saved successfully."
      });

      // Refresh data
      fetchDailyMenu();
    } catch (error) {
      console.error('Error saving daily menu:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save daily menu. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Daily Menu</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded-md p-2 text-sm"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading daily menu...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Dish</th>
                    <th className="p-2 text-left">Category</th>
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-left">Quantity</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-500">
                        No dishes added to the daily menu yet.
                      </td>
                    </tr>
                  ) : (
                    menuItems.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">
                          <select
                            value={item.dish_id}
                            onChange={(e) => handleDishChange(index, e.target.value)}
                            className="w-full p-2 border rounded"
                          >
                            {dishes.map((dish) => (
                              <option key={dish.id} value={dish.id}>
                                {dish.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-2">{item.dish?.category}</td>
                        <td className="p-2">${item.dish?.price.toFixed(2)}</td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                            className="w-20 p-2 border rounded"
                          />
                        </td>
                        <td className="p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMenuItem(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between">
              <Button onClick={handleAddMenuItem} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Dish
              </Button>
              <Button onClick={handleSaveMenu} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Menu'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
