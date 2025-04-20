
export interface Restaurant {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  image_url?: string;
  oven_temperature?: number;
  cooling_chamber_temperature?: number;
}

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'director' | 'chef' | 'waiter' | 'cashier' | 'delivery' | 'client';
  phone?: string;
  salary?: number;
  hire_date: string;
}

export interface Dish {
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

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  price_per_unit: number;
  current_stock?: number;
}

export interface Report {
  id: string;
  title: string;
  content: string;
  date: string;
  sent_to_admin: boolean;
  status: string;
  updated_at: string;
}

export interface Order {
  id: string;
  table_number?: number;
  total_amount: number;
  status: string;
  created_at: string;
}
