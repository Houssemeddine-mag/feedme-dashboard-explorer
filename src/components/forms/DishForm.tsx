
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, Plus, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(10, "Description should be at least 10 characters"),
  recipe: z.string().min(10, "Recipe should be at least 10 characters"),
});

type DishFormValues = z.infer<typeof formSchema>;

interface DishFormProps {
  onSubmit: (data: DishFormValues) => void;
  onCancel: () => void;
  ingredients: { id: number; name: string }[];
}

const DishForm = ({ onSubmit, onCancel, ingredients }: DishFormProps) => {
  const [dishImage, setDishImage] = useState<string | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("DZD");
  
  const form = useForm<DishFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      price: "",
      description: "",
      recipe: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDishImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleIngredient = (ingredientId: number) => {
    setSelectedIngredients((prev) => 
      prev.includes(ingredientId)
        ? prev.filter(id => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const handleSubmit = (data: DishFormValues) => {
    // Include image and ingredients in submission
    onSubmit({
      ...data,
      dishImage,
      ingredients: selectedIngredients,
      currency: selectedCurrency,
    });
  };

  const categories = [
    "Main Course",
    "Appetizer",
    "Dessert",
    "Beverage",
    "Side Dish",
    "Special"
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dish Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Classic Burger" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <Label>Dish Image</Label>
            <div className="mt-1">
              <div className="relative">
                {dishImage ? (
                  <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                    <img
                      src={dishImage}
                      alt="Dish preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute right-1 top-1 rounded-full bg-white p-1 shadow-sm"
                      onClick={() => setDishImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="dishImage"
                    className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                  >
                    <Upload className="mb-2 h-6 w-6 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Upload dish image
                    </span>
                    <input
                      id="dishImage"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label>Ingredients</Label>
            <div className="mt-1 p-3 border rounded-md">
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedIngredients.length > 0 ? (
                  selectedIngredients.map((id) => {
                    const ingredient = ingredients.find((i) => i.id === id);
                    return (
                      <Badge key={id} variant="secondary" className="flex items-center gap-1">
                        {ingredient?.name}
                        <button
                          type="button"
                          onClick={() => toggleIngredient(id)}
                          className="ml-1 h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })
                ) : (
                  <span className="text-sm text-gray-500">No ingredients selected</span>
                )}
              </div>
              <Select onValueChange={(value) => toggleIngredient(Number(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Add ingredient" />
                </SelectTrigger>
                <SelectContent>
                  {ingredients
                    .filter((ingredient) => !selectedIngredients.includes(ingredient.id))
                    .map((ingredient) => (
                      <SelectItem key={ingredient.id} value={ingredient.id.toString()}>
                        {ingredient.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the dish..." 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recipe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipe</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter the recipe instructions..." 
                    className="min-h-[150px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-end space-x-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        placeholder="0.00" 
                        {...field} 
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <Select
                          value={selectedCurrency}
                          onValueChange={setSelectedCurrency}
                        >
                          <SelectTrigger className="border-0 w-[80px] focus:ring-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DZD">DZD</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-feedme-500 hover:bg-feedme-600">
            Create Dish
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DishForm;
