import { Product } from "@/types/product";

export type PagedProducts = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  data: Product[];
};

export interface ProductFilters {
  page?: number;
  size?: number;
  category?: string;
  brand?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  keyword?:string;
}

/**
 * Fetch all products (paged) from the backend API with optional filters.
 * Returns the paged structure on success, or null on failure.
 */
export async function getAllProduct(
  filters: ProductFilters = {}
): Promise<PagedProducts | null> {
  try {
    const params = new URLSearchParams();
    params.set('page', String(filters.page ?? 1));
    params.set('size', String(filters.size ?? 10));
    
    if (filters.category) params.set('category', filters.category);
    if (filters.brand) params.set('brand', filters.brand);
    if (filters.color) params.set('color', filters.color);
    if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
    if (filters.search) params.set('search', filters.search);
    if(filters.keyword) params.set('keyword',filters.keyword);
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product?${params.toString()}`, { cache: "no-store" });

    if (!res.ok) {
      // Try to get error message from response
      let errText = `${res.status} ${res.statusText}`;
      try {
        const body = await res.json();
        if (body && body.message) errText = body.message;
      } catch (e) {
        // ignore json parse errors
      }
      throw new Error(`Failed to fetch products: ${errText}`);
    }

  const json = await res.json();
    json?.data?.forEach((p: any, i: number) => {
      console.log(`Product #${i} images count:`, p.images?.length);
    });
    // Basic validation: ensure shape contains data array
    if (!json || !Array.isArray(json.data)) {
      throw new Error("Invalid product response shape");
    }

    return json as PagedProducts;
  } catch (error) {
    // Keep error handling here: log and return null so callers can handle gracefully
    // eslint-disable-next-line no-console
    console.error("getAllProduct error:", error);
    return null;
  }
}

/**
 * Fetch product detail by id from the backend API.
 * Returns the Product on success, or null on failure.
 */
export async function getProductDetail(
  productId: number | string
): Promise<Product | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/${productId}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      let errText = `${res.status} ${res.statusText}`;
      try {
        const body = await res.json();
        if (body && body.message) errText = body.message;
      } catch (e) {
        // ignore
      }
      throw new Error(`Failed to fetch product detail: ${errText}`);
    }

    const json = await res.json();

    // Basic validation: expect object with id
    if (!json || typeof json.id !== "number") {
      throw new Error("Invalid product detail response shape");
    }

    return json as Product;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("getProductDetail error:", error);
    return null;
  }
}

/**
 * Build a FormData payload for product create/update requests.
 * The backend expects a multipart/form-data body with:
 *  - productRequest: JSON (stringified)
 *  - images: one or more file parts
 */
export function buildProductFormData(
  productRequest: Record<string, any>,
  images: File[]
): FormData {
  const fd = new FormData();
  // Stringify JSON payload into a part named 'productRequest'
  fd.append(
    "product",
    new Blob([JSON.stringify(productRequest)], { type: "application/json" })
  );

  // Append all images. Reusing the same key name is standard for arrays in multipart.
  images.forEach((file) => {
    if (file instanceof File) {
      fd.append("images", file, file.name);
    }
  });

  return fd;
}

/**
 * Create a new product (POST /product)
 */
export async function createProduct(
  productRequest: Record<string, any>,
  images: File[]
): Promise<Response> {
  const fd = buildProductFormData(productRequest, images);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
    method: "POST",
    body: fd,
    // Do NOT set Content-Type manually for multipart; the browser will set the correct boundary.
  });
  return res;
}

/**
 * Update an existing product (PUT /product/{id})
 */
export async function updateProduct(
  productId: number | string,
  productRequest: Record<string, any>,
  images: File[]
): Promise<Response> {
  const fd = buildProductFormData(productRequest, images);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/product/${productId}`,
    {
      method: "PUT",
      body: fd,
    }
  );
  return res;
}

/**
 * Fetch unique brands from all products for filter component.
 * Returns an array of unique brand names sorted alphabetically.
 */
export async function getUniqueBrands(): Promise<string[]> {
  try {
    // Fetch a large page of products to get all brands
    const response = await getAllProduct({ page: 1, size: 1000 });
    
    if (!response || !response.data) {
      return [];
    }

    // Extract unique brands
    const brandsSet = new Set<string>();
    response.data.forEach((product) => {
      if (product.brand && product.brand.trim()) {
        brandsSet.add(product.brand.trim());
      }
    });

    // Convert to array and sort alphabetically
    return Array.from(brandsSet).sort();
  } catch (error) {
    console.error('getUniqueBrands error:', error);
    return [];
  }
}
