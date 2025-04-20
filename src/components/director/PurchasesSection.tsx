
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ShoppingCart, Eye, FileText, DollarSign } from "lucide-react";
import { Ingredient } from "@/types/director";

interface PurchasesSectionProps {
  restaurantId: string;
}

interface IngredientPurchase {
  id: string;
  date: string;
  total_amount: number;
  restaurant_id: string;
  created_at: string;
}

interface PurchaseItem {
  id: string;
  purchase_id: string;
  ingredient_id: string;
  ingredient_name?: string;
  quantity: number;
  price_per_unit: number;
  total_price: number;
}

export const PurchasesSection = ({ restaurantId }: PurchasesSectionProps) => {
  const [purchases, setPurchases] = useState<IngredientPurchase[]>([]);
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewPurchaseOpen, setIsViewPurchaseOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<IngredientPurchase | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPurchases();
    fetchIngredients();
  }, [restaurantId]);

  const fetchPurchases = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('ingredient_purchases')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('date', { ascending: false });

      if (error) throw error;
      setPurchases(data || []);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch ingredient purchases. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIngredients = async () => {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setIngredients(data || []);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  const fetchPurchaseItems = async (purchaseId: string) => {
    try {
      const { data, error } = await supabase
        .from('ingredient_purchase_items')
        .select(`
          *,
          ingredient:ingredients(name)
        `)
        .eq('purchase_id', purchaseId);

      if (error) throw error;

      // Format the data
      const formattedItems = data.map(item => ({
        ...item,
        ingredient_name: item.ingredient?.name
      }));

      setPurchaseItems(formattedItems);
    } catch (error) {
      console.error('Error fetching purchase items:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch purchase details. Please try again."
      });
    }
  };

  const handleViewPurchase = (purchase: IngredientPurchase) => {
    setSelectedPurchase(purchase);
    fetchPurchaseItems(purchase.id);
    setIsViewPurchaseOpen(true);
  };

  const purchaseColumns = [
    { 
      header: "Date", 
      accessorKey: "date",
      cell: (item: IngredientPurchase) => format(new Date(item.date), 'PP')
    },
    { 
      header: "Total Amount", 
      accessorKey: "total_amount",
      cell: (item: IngredientPurchase) => `$${Number(item.total_amount).toFixed(2)}`
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: (item: IngredientPurchase) => format(new Date(item.created_at), 'Pp')
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item: IngredientPurchase) => (
        <Button variant="ghost" size="sm" onClick={() => handleViewPurchase(item)}>
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      )
    }
  ];

  const purchaseItemColumns = [
    { 
      header: "Ingredient", 
      accessorKey: "ingredient_name"
    },
    { 
      header: "Quantity", 
      accessorKey: "quantity"
    },
    { 
      header: "Price per Unit", 
      accessorKey: "price_per_unit",
      cell: (item: PurchaseItem) => `$${Number(item.price_per_unit).toFixed(2)}`
    },
    { 
      header: "Total Price", 
      accessorKey: "total_price",
      cell: (item: PurchaseItem) => `$${Number(item.total_price).toFixed(2)}`
    }
  ];

  const renderPurchaseList = () => {
    if (isLoading) {
      return (
        <div className="text-center py-8">
          <p>Loading purchases...</p>
        </div>
      );
    }
    
    return (
      <DataTable
        data={purchases}
        columns={purchaseColumns}
        filterPlaceholder="Search purchases..."
        onSearchChange={() => {}}
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Ingredient Purchases
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {renderPurchaseList()}

        {/* View Purchase Details Dialog */}
        <Dialog open={isViewPurchaseOpen} onOpenChange={setIsViewPurchaseOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Purchase Details
              </DialogTitle>
            </DialogHeader>
            
            {selectedPurchase && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p>{format(new Date(selectedPurchase.date), 'PP')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Amount</p>
                    <p className="flex items-center text-green-600 font-medium">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {Number(selectedPurchase.total_amount).toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Items</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 text-left">Ingredient</th>
                          <th className="p-2 text-left">Quantity</th>
                          <th className="p-2 text-left">Price per Unit</th>
                          <th className="p-2 text-left">Total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseItems.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-gray-500">
                              No items found in this purchase.
                            </td>
                          </tr>
                        ) : (
                          purchaseItems.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">{item.ingredient_name}</td>
                              <td className="p-2">{item.quantity}</td>
                              <td className="p-2">${Number(item.price_per_unit).toFixed(2)}</td>
                              <td className="p-2">${Number(item.total_price).toFixed(2)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button onClick={() => setIsViewPurchaseOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
