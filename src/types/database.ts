
export type UserRole = 'admin' | 'director' | 'chef' | 'waiter' | 'cashier' | 'client' | 'delivery';

export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  role: UserRole;
  phone_number?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  image_url?: string;
  oven_temperature?: number;
  cooling_chamber_temperature?: number;
  created_at: string;
  updated_at: string;
}
