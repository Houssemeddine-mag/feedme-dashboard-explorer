
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Ingredient {
  id: string;
  price_per_unit: number;
}

interface Dish {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url?: string;
  ingredients?: Array<{
    ingredient_id: string;
    quantity_needed: number;
  }>;
}

interface DailyDishItemProps {
  dish: Dish;
  ingredients: Ingredient[];
  onQuantityChange: (dishId: string, quantity: number) => void;
  selectedQuantity?: number;
}

export const DailyDishItem = ({ dish, ingredients, onQuantityChange, selectedQuantity = 0 }: DailyDishItemProps) => {
  const calculateCost = () => {
    if (!dish.ingredients) return 0;
    
    return dish.ingredients.reduce((total: number, item: any) => {
      const ingredient = ingredients.find((ing: any) => ing.id === item.ingredient_id);
      if (ingredient) {
        return total + (ingredient.price_per_unit * item.quantity_needed * selectedQuantity);
      }
      return total;
    }, 0);
  };

  const cost = calculateCost();

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-0">
      <div className="flex items-center">
        {dish.image_url && (
          <img 
            src={dish.image_url} 
            alt={dish.name} 
            className="w-12 h-12 object-cover rounded-md mr-4"
          />
        )}
        <div>
          <div className="font-medium">{dish.name}</div>
          <div className="text-sm text-gray-500">{dish.category}</div>
          <div className="text-xs text-gray-400">${dish.price.toFixed(2)}</div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div>
          <div className="text-sm text-gray-500">Cost: <span className="font-medium">${cost.toFixed(2)}</span></div>
          <div className="text-xs text-gray-400">For {selectedQuantity} units</div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuantityChange(dish.id, Math.max(0, selectedQuantity - 1))}
            disabled={selectedQuantity <= 0}
          >
            -
          </Button>
          <Input 
            type="number" 
            min="0"
            value={selectedQuantity}
            onChange={(e) => onQuantityChange(dish.id, parseInt(e.target.value) || 0)}
            className="w-16 text-center h-8"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuantityChange(dish.id, selectedQuantity + 1)}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};
