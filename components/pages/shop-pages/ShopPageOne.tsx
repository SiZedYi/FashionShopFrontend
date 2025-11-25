"use client";
import FilterProducts from "@/components/products/FilterProducts";
import ShopPageContainer from "@/components/products/ShopPageContainer";
import React, { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface FilterState {
  category: string;
  brand: string;
  color: string;
  minPrice: number;
  maxPrice: number;
}

const ShopPageOne = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get filters from query params
  const filters: FilterState = {
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    color: searchParams.get("color") || "",
    minPrice: Number(searchParams.get("minPrice")) || 10,
    maxPrice: Number(searchParams.get("maxPrice")) || 5000,
  };

  // Update query params when filters change
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams();
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.brand) params.set("brand", newFilters.brand);
    if (newFilters.color) params.set("color", newFilters.color);
    if (newFilters.minPrice !== undefined) params.set("minPrice", String(newFilters.minPrice));
    if (newFilters.maxPrice !== undefined) params.set("maxPrice", String(newFilters.maxPrice));
    router.replace(`?${params.toString()}`);
  }, [router]);

  return (
    <section className="max-w-screen-xl flex gap-2 mx-auto p-2 md:p-8">
      <div className="hidden xl:block w-72">
        <FilterProducts onFiltersChange={handleFiltersChange} filters={filters} />
      </div>
      <ShopPageContainer gridColumn={3} filters={filters} />
    </section>
  );
};

export default ShopPageOne;
