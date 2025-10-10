import { Product } from "./product";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  images?: string[];
  selectedColor?: string;
  productId?: number;
  color: string[];
  // add other fields as needed
}
