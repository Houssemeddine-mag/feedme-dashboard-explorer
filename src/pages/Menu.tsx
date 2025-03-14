
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { 
  PencilRuler, 
  Utensils, 
  UtensilsCrossed, 
  Leaf, 
  PackageOpen, 
  Plus, 
  PenLine, 
  Trash2, 
  DollarSign,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import DishForm from "@/components/forms/DishForm";
import PackForm from "@/components/forms/PackForm";

// Mock data
const dishesData = [
  { 
    id: 1, 
    name: "Classic Burger", 
    category: "Main Course",
    price: 12.99,
    ingredients: 8,
    popularity: "High",
    recipe: "Available"
  },
  { 
    id: 2, 
    name: "Caesar Salad", 
    category: "Appetizer",
    price: 8.99,
    ingredients: 6,
    popularity: "Medium",
    recipe: "Available"
  },
  { 
    id: 3, 
    name: "Margherita Pizza", 
    category: "Main Course",
    price: 14.99,
    ingredients: 5,
    popularity: "High",
    recipe: "Available"
  },
  { 
    id: 4, 
    name: "Chocolate Cake", 
    category: "Dessert",
    price: 7.99,
    ingredients: 10,
    popularity: "High",
    recipe: "Available"
  },
  { 
    id: 5, 
    name: "Chicken Wings", 
    category: "Appetizer",
    price: 10.99,
    ingredients: 4,
    popularity: "Medium",
    recipe: "Available"
  },
];

const ingredientsData = [
  { id: 1, name: "Ground Beef", supplier: "Quality Meats Inc.", unit: "lb", price: 4.50, stock: 120 },
  { id: 2, name: "Lettuce", supplier: "Fresh Farms", unit: "head", price: 1.25, stock: 85 },
  { id: 3, name: "Tomato", supplier: "Fresh Farms", unit: "lb", price: 2.00, stock: 95 },
  { id: 4, name: "Cheese", supplier: "Dairy Best", unit: "lb", price: 3.75, stock: 65 },
  { id: 5, name: "Chicken", supplier: "Quality Meats Inc.", unit: "lb", price: 3.25, stock: 110 },
  { id: 6, name: "Flour", supplier: "Baker's Supply", unit: "lb", price: 0.80, stock: 200 },
  { id: 7, name: "Sugar", supplier: "Baker's Supply", unit: "lb", price: 0.95, stock: 180 },
];

const extrasData = [
  { id: 1, name: "French Fries", category: "Side", price: 2.99 },
  { id: 2, name: "Cola", category: "Beverage", price: 1.99 },
  { id: 3, name: "Lemonade", category: "Beverage", price: 1.99 },
  { id: 4, name: "Garlic Bread", category: "Side", price: 3.49 },
  { id: 5, name: "Coleslaw", category: "Side", price: 2.49 },
];

const packsData = [
  { 
    id: 1, 
    name: "Family Feast", 
    items: 4,
    regularPrice: 45.99,
    discountPrice: 39.99,
    popularity: "High",
    savings: "13%"
  },
  { 
    id: 2, 
    name: "Date Night Special", 
    items: 3,
    regularPrice: 32.99,
    discountPrice: 27.99,
    popularity: "Medium",
    savings: "15%"
  },
  { 
    id: 3, 
    name: "Kids Combo", 
    items: 3,
    regularPrice: 15.99,
    discountPrice: 12.99,
    popularity: "High",
    savings: "19%"
  },
  { 
    id: 4, 
    name: "Party Pack", 
    items: 6,
    regularPrice: 89.99,
    discountPrice: 74.99,
    popularity: "Low",
    savings: "17%"
  },
];

const Menu = () => {
  const [activeTab, setActiveTab] = useState("dishes");
  const [dishes, setDishes] = useState(dishesData);
  const [ingredients] = useState(ingredientsData);
  const [extras] = useState(extrasData);
  const [packs, setPacks] = useState(packsData);
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [isAddPackOpen, setIsAddPackOpen] = useState(false);
  const [currency, setCurrency] = useState("DZD");
  
  const formatCurrency = (value: number) => {
    switch(currency) {
      case "USD":
        return `$${value.toFixed(2)}`;
      case "EUR":
        return `€${value.toFixed(2)}`;
      default:
        return `${value.toFixed(2)} DZD`;
    }
  };

  const handleAddDish = (data: any) => {
    // Create a new dish with the form data
    const newDish = {
      id: dishes.length + 1,
      name: data.name,
      category: data.category,
      price: parseFloat(data.price),
      ingredients: data.ingredients?.length || 0,
      popularity: "Medium",
      recipe: "Available"
    };
    
    setDishes([...dishes, newDish]);
    setIsAddDishOpen(false);
  };

  const handleAddPack = (data: any) => {
    // Create a new pack with the form data
    const regularPrice = parseFloat(data.price);
    const discountPrice = regularPrice * 0.85; // 15% discount for example
    const savings = Math.round((1 - (discountPrice / regularPrice)) * 100) + "%";
    
    const newPack = {
      id: packs.length + 1,
      name: data.name,
      items: (data.dishes?.length || 0) + (data.extras?.length || 0),
      regularPrice: regularPrice,
      discountPrice: discountPrice,
      popularity: "Medium",
      savings: savings
    };
    
    setPacks([...packs, newPack]);
    setIsAddPackOpen(false);
  };

  const dishFilterOptions = [
    { label: "All Categories", value: "all" },
    { label: "Main Course", value: "main" },
    { label: "Appetizer", value: "appetizer" },
    { label: "Dessert", value: "dessert" },
    { label: "Price (High to Low)", value: "price-desc" },
    { label: "Price (Low to High)", value: "price-asc" },
  ];

  const ingredientFilterOptions = [
    { label: "All Suppliers", value: "all" },
    { label: "Fresh Farms", value: "fresh-farms" },
    { label: "Quality Meats Inc.", value: "quality-meats" },
    { label: "Baker's Supply", value: "bakers-supply" },
    { label: "Dairy Best", value: "dairy-best" },
  ];

  const packFilterOptions = [
    { label: "All Packs", value: "all" },
    { label: "By Popularity", value: "popularity" },
    { label: "By Savings", value: "savings" },
  ];

  const dishColumns = [
    {
      header: "Dish Name",
      accessorKey: "name",
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (dish: any) => (
        <Badge variant="outline" className="font-normal">
          {dish.category}
        </Badge>
      ),
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (dish: any) => formatCurrency(dish.price),
    },
    {
      header: "Ingredients",
      accessorKey: "ingredients",
    },
    {
      header: "Popularity",
      accessorKey: "popularity",
      cell: (dish: any) => {
        const popularityColor = 
          dish.popularity === "High" ? "text-green-600" :
          dish.popularity === "Medium" ? "text-feedme-500" : "text-gray-500";
        
        return <span className={popularityColor}>{dish.popularity}</span>;
      },
    },
    {
      header: "Recipe",
      accessorKey: "recipe",
      cell: (dish: any) => (
        <Button size="sm" variant="outline" className="h-8">
          <FileText className="h-4 w-4 mr-2 text-gray-500" />
          View Recipe
        </Button>
      ),
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

  const ingredientColumns = [
    {
      header: "Ingredient",
      accessorKey: "name",
    },
    {
      header: "Supplier",
      accessorKey: "supplier",
    },
    {
      header: "Unit",
      accessorKey: "unit",
    },
    {
      header: "Price/Unit",
      accessorKey: "price",
      cell: (ingredient: any) => `$${ingredient.price.toFixed(2)}`,
    },
    {
      header: "Stock",
      accessorKey: "stock",
      cell: (ingredient: any) => {
        const stockColor = 
          ingredient.stock > 100 ? "text-green-600" :
          ingredient.stock > 50 ? "text-feedme-500" : "text-red-500";
        
        return <span className={stockColor}>{ingredient.stock} {ingredient.unit}</span>;
      },
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

  const packColumns = [
    {
      header: "Pack Name",
      accessorKey: "name",
    },
    {
      header: "Items",
      accessorKey: "items",
    },
    {
      header: "Regular Price",
      accessorKey: "regularPrice",
      cell: (pack: any) => formatCurrency(pack.regularPrice),
    },
    {
      header: "Discount Price",
      accessorKey: "discountPrice",
      cell: (pack: any) => formatCurrency(pack.discountPrice),
    },
    {
      header: "Savings",
      accessorKey: "savings",
      cell: (pack: any) => <span className="text-green-600">{pack.savings}</span>,
    },
    {
      header: "Popularity",
      accessorKey: "popularity",
      cell: (pack: any) => {
        const popularityColor = 
          pack.popularity === "High" ? "text-green-600" :
          pack.popularity === "Medium" ? "text-feedme-500" : "text-gray-500";
        
        return <span className={popularityColor}>{pack.popularity}</span>;
      },
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
        <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
        <p className="mt-1 text-gray-500">
          Manage dishes, ingredients, and promotional packs.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="dishes" className="data-[state=active]:bg-feedme-500 data-[state=active]:text-white">
            Dishes
          </TabsTrigger>
          <TabsTrigger value="ingredients" className="data-[state=active]:bg-feedme-500 data-[state=active]:text-white">
            Ingredients
          </TabsTrigger>
          <TabsTrigger value="packs" className="data-[state=active]:bg-feedme-500 data-[state=active]:text-white">
            Packs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dishes" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard
                title="Total Dishes"
                value={dishes.length}
                icon={Utensils}
              />
              <StatsCard
                title="Average Price"
                value={formatCurrency(dishes.reduce((sum, d) => sum + d.price, 0) / dishes.length)}
                icon={DollarSign}
              />
              <StatsCard
                title="Most Popular Category"
                value="Main Course"
                icon={UtensilsCrossed}
              />
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-4">Dish Management</h2>
              <DataTable
                data={dishes}
                columns={dishColumns}
                filterOptions={dishFilterOptions}
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
                      onClick={() => setIsAddDishOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Dish
                    </Button>
                  </div>
                }
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="ingredients" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard
                title="Total Ingredients"
                value={ingredientsData.length}
                icon={Leaf}
              />
              <StatsCard
                title="Low Stock Ingredients"
                value={ingredientsData.filter(i => i.stock < 70).length}
                icon={PencilRuler}
              />
              <StatsCard
                title="Unique Suppliers"
                value={new Set(ingredientsData.map(i => i.supplier)).size}
                icon={Utensils}
              />
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-4">Ingredient Management</h2>
              <DataTable
                data={ingredientsData}
                columns={ingredientColumns}
                filterOptions={ingredientFilterOptions}
                actionComponent={
                  <Button variant="default" className="bg-feedme-500 hover:bg-feedme-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Ingredient
                  </Button>
                }
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="packs" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard
                title="Total Packs"
                value={packs.length}
                icon={PackageOpen}
              />
              <StatsCard
                title="Average Discount"
                value="16%"
                icon={DollarSign}
              />
              <StatsCard
                title="Most Popular Pack"
                value="Family Feast"
                icon={UtensilsCrossed}
              />
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-4">Pack Management</h2>
              <DataTable
                data={packs}
                columns={packColumns}
                filterOptions={packFilterOptions}
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
                      onClick={() => setIsAddPackOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Pack
                    </Button>
                  </div>
                }
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Dish Dialog */}
      <Dialog open={isAddDishOpen} onOpenChange={setIsAddDishOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Dish</DialogTitle>
          </DialogHeader>
          <DishForm 
            onSubmit={handleAddDish}
            onCancel={() => setIsAddDishOpen(false)}
            ingredients={ingredients}
          />
        </DialogContent>
      </Dialog>

      {/* Add Pack Dialog */}
      <Dialog open={isAddPackOpen} onOpenChange={setIsAddPackOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Pack</DialogTitle>
          </DialogHeader>
          <PackForm 
            onSubmit={handleAddPack}
            onCancel={() => setIsAddPackOpen(false)}
            dishes={dishes}
            extras={extras}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Menu;
