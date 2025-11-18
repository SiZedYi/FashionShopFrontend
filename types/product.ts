export interface Product {
  id: number;
  name: string;
  category: string;
  categories?: string[];
  description: string;
  aboutItem: string;
  price: number;
  discount?: number;
  rating?: number;
  stockItems: number;
  brand?: string;
  color: string[];
  images: string[];
  reviews?: any[];
}
