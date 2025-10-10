export type Product = {
  id: number;
  name: string;
  category?: string;
  description?: string;
  aboutItem?: string;
  price: number;
  discount?: number;
  rating?: number;
  stockItems?: number;
  brand?: string;
  color?: string[];
  images?: string[];
};

export type PagedProducts = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  data: Product[];
};

/**
 * Fetch all products (paged) from the backend API.
 * Returns the paged structure on success, or null on failure.
 */
export async function getAllProduct(): Promise<PagedProducts | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, { cache: "no-store" });

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
    console.log("API raw response:", JSON.stringify(json, null, 2));
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
