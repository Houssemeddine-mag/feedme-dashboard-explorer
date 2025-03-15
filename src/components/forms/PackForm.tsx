
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
import { Upload, X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.string().min(1, "Category is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  description: z.string().min(10, "Description should be at least 10 characters"),
  price: z.string().min(1, "Price is required"),
  packImage: z.string().nullable().optional(),
  dishes: z.array(z.number()).optional(),
  extras: z.array(z.number()).optional(),
  currency: z.string().optional(),
});

type PackFormValues = z.infer<typeof formSchema>;

interface PackFormProps {
  onSubmit: (data: PackFormValues) => void;
  onCancel: () => void;
  dishes: { id: number; name: string }[];
  extras: { id: number; name: string }[];
}

const PackForm = ({ onSubmit, onCancel, dishes, extras }: PackFormProps) => {
  const [packImage, setPackImage] = useState<string | null>(null);
  const [selectedDishes, setSelectedDishes] = useState<number[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("DZD");
  
  const form = useForm<PackFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      targetAudience: "",
      description: "",
      price: "",
      packImage: null,
      dishes: [],
      extras: [],
      currency: "DZD",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPackImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDish = (dishId: number) => {
    setSelectedDishes((prev) => 
      prev.includes(dishId)
        ? prev.filter(id => id !== dishId)
        : [...prev, dishId]
    );
  };

  const toggleExtra = (extraId: number) => {
    setSelectedExtras((prev) => 
      prev.includes(extraId)
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

  const handleSubmit = (data: PackFormValues) => {
    // Include image, dishes, and extras in submission
    onSubmit({
      ...data,
      packImage,
      dishes: selectedDishes,
      extras: selectedExtras,
      currency: selectedCurrency,
    });
  };

  const categories = [
    "Family Pack",
    "Individual Pack",
    "Combo Pack",
    "Special Pack",
    "Breakfast Pack",
    "Lunch Pack",
    "Dinner Pack"
  ];

  const targetAudiences = [
    "General",
    "Children",
    "Students",
    "Gym Attendees",
    "Office Workers",
    "Discount",
    "Family"
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
                  <FormLabel>Pack Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Family Feast" {...field} />
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
            <Label>Pack Image</Label>
            <div className="mt-1">
              <div className="relative">
                {packImage ? (
                  <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                    <img
                      src={packImage}
                      alt="Pack preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute right-1 top-1 rounded-full bg-white p-1 shadow-sm"
                      onClick={() => setPackImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="packImage"
                    className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                  >
                    <Upload className="mb-2 h-6 w-6 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Upload pack image
                    </span>
                    <input
                      id="packImage"
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
            <Label>Dishes Included</Label>
            <div className="mt-1 p-3 border rounded-md">
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedDishes.length > 0 ? (
                  selectedDishes.map((id) => {
                    const dish = dishes.find((d) => d.id === id);
                    return (
                      <Badge key={id} variant="secondary" className="flex items-center gap-1">
                        {dish?.name}
                        <button
                          type="button"
                          onClick={() => toggleDish(id)}
                          className="ml-1 h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })
                ) : (
                  <span className="text-sm text-gray-500">No dishes selected</span>
                )}
              </div>
              <Select onValueChange={(value) => toggleDish(Number(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Add dish" />
                </SelectTrigger>
                <SelectContent>
                  {dishes
                    .filter((dish) => !selectedDishes.includes(dish.id))
                    .map((dish) => (
                      <SelectItem key={dish.id} value={dish.id.toString()}>
                        {dish.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Additional Items</Label>
            <div className="mt-1 p-3 border rounded-md">
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedExtras.length > 0 ? (
                  selectedExtras.map((id) => {
                    const extra = extras.find((e) => e.id === id);
                    return (
                      <Badge key={id} variant="secondary" className="flex items-center gap-1">
                        {extra?.name}
                        <button
                          type="button"
                          onClick={() => toggleExtra(id)}
                          className="ml-1 h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })
                ) : (
                  <span className="text-sm text-gray-500">No extras selected</span>
                )}
              </div>
              <Select onValueChange={(value) => toggleExtra(Number(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Add extra item" />
                </SelectTrigger>
                <SelectContent>
                  {extras
                    .filter((extra) => !selectedExtras.includes(extra.id))
                    .map((extra) => (
                      <SelectItem key={extra.id} value={extra.id.toString()}>
                        {extra.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <FormField
            control={form.control}
            name="targetAudience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Audience</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {targetAudiences.map((audience) => (
                      <SelectItem key={audience} value={audience}>
                        {audience}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the pack..." 
                    className="min-h-[100px]" 
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
            Create Pack
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PackForm;
