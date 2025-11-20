"use client";
import FilterProducts from "@/components/products/FilterProducts";
import ShopPageContainer from "@/components/products/ShopPageContainer";
import React, { useState } from "react";

export interface FilterState {
  category: string;
  brand: string;
  color: string;
  minPrice: number;
  maxPrice: number;
}

const ShopPageOne = () => {
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    brand: "",
    color: "",
    minPrice: 10,
    maxPrice: 5000,
  });

  return (
    <section className="max-w-screen-xl flex gap-2 mx-auto p-2 md:p-8">
      <div className="hidden xl:block w-72">
        <FilterProducts onFiltersChange={setFilters} />
      </div>
      <ShopPageContainer gridColumn={3} filters={filters} />
    </section>
  );
};

export default ShopPageOne;
