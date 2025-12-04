import { Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function searchProducts(keyword: string, page = 1, size = 10): Promise<Product[]> {
  if (!keyword || !keyword.trim()) return [];
  try {
    const params = new URLSearchParams({ keyword: keyword.trim(), page: String(page), size: String(size) });
    const res = await fetch(`${API_URL}/search?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) {
      console.error('searchProducts failed', res.status, res.statusText);
      return [];
    }
    const data = await res.json();
    if (Array.isArray(data)) return data as Product[];
    if (Array.isArray(data?.data)) return data.data as Product[];
    if (Array.isArray(data?.items)) return data.items as Product[];
    return [];
  } catch (err) {
    console.error('searchProducts error', err);
    return [];
  }
}
