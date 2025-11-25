"use client";
import React, { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { COLOR_OPTIONS } from "@/const/color";
import { getCategoriesForFilter, Category } from "@/service/category";
import { getUniqueBrands } from "@/service/product";

interface FilterProductsProps {
  onFiltersChange?: (filters: {
    category: string;
    brand: string;
    color: string;
    minPrice: number;
    maxPrice: number;
  }) => void;
  filters?: {
    category: string;
    brand: string;
    color: string;
    minPrice: number;
    maxPrice: number;
  };
}

const FilterProducts = ({ onFiltersChange, filters }: FilterProductsProps) => {
  // State variables for filters
  const [minValue, setMinValue] = useState(filters?.minPrice ?? 10);
  const [maxValue, setMaxValue] = useState(filters?.maxPrice ?? 5000);
  const [selectedCategory, setSelectedCategory] = useState(filters?.category ?? "");
  const [selectedColor, setSelectedColor] = useState(filters?.color ?? "");
  const [selectedBrand, setSelectedBrand] = useState(filters?.brand ?? "");

  // State for fetched data
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories and brands on mount
  useEffect(() => {
    const fetchFilters = async () => {
      setLoading(true);
      try {
        const [fetchedCategories, fetchedBrands] = await Promise.all([
          getCategoriesForFilter(20),
          getUniqueBrands(),
        ]);
        setCategories(fetchedCategories);
        setBrands(fetchedBrands);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  // Sync local state with filters prop (from query params)
  useEffect(() => {
    if (filters) {
      setMinValue(filters.minPrice ?? 10);
      setMaxValue(filters.maxPrice ?? 5000);
      setSelectedCategory(filters.category ?? "");
      setSelectedColor(filters.color ?? "");
      setSelectedBrand(filters.brand ?? "");
    }
  }, [filters]);

  // Notify parent component whenever filters change
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange({
        category: selectedCategory,
        brand: selectedBrand,
        color: selectedColor,
        minPrice: minValue,
        maxPrice: maxValue,
      });
    }
  }, [selectedCategory, selectedBrand, selectedColor, minValue, maxValue, onFiltersChange]);

  // Selection handler functions - update state only, no URL changes
  const handleCategorySelection = (category: string) => {
    if (category === selectedCategory) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
  };

  // Update min price and max price with correct values
  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMinValue = Number(event.target.value);
    setMinValue(newMinValue);
  };

  // Update max price with correct value
  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMaxValue = Number(event.target.value);
    setMaxValue(newMaxValue);
  };

  const handleColorSelection = (colorName: string) => {
    if (colorName === selectedColor) {
      setSelectedColor("");
    } else {
      setSelectedColor(colorName);
    }
  };

  const handleBrandSelection = (brand: string) => {
    if (brand === selectedBrand) {
      setSelectedBrand("");
    } else {
      setSelectedBrand(brand);
    }
  };

  const clearFilter = () => {
    setSelectedCategory("");
    setSelectedColor("");
    setSelectedBrand("");
    setMinValue(10);
    setMaxValue(5000);
  };

  return (
    <aside className="w-72 p-2 space-y-4 ">
      <h2 className="text-xl font-bold capitalize my-2">Filter Products</h2>
      <Separator />
      {/* filter by price */}
      <div>
        <h3 className="text-lg font-medium my-2">By Price</h3>
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label htmlFor="min">Min :</Label>
            <Input
              id="min"
              placeholder="$10"
              value={minValue}
              min={2}
              type="number"
              onChange={handleMinPriceChange}
            />
          </div>
          <div>
            <Label htmlFor="max">Max :</Label>
            <Input
              id="max"
              placeholder="$2000"
              min={2}
              value={maxValue}
              type="number"
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>
        <div className="flex items-center justify-center flex-wrap">
          <Input
            onChange={handleMaxPriceChange}
            type="range"
            min={5}
            max={5000}
            value={maxValue}
          />
          <p className="text-center text-green-500 text-2xl">${maxValue}</p>
        </div>
      </div>

      {/* filter by category */}
      <div>
        <h3 className="text-lg font-medium my-2">By Categories</h3>
        {loading ? (
          <p className="text-sm text-gray-500">Loading categories...</p>
        ) : (
          <div className="flex items-center justify-start gap-2 flex-wrap">
            {categories.map((category) => (
              <p
                onClick={() => handleCategorySelection(category.name)}
                className={cn(
                  "px-4 py-1 rounded-full bg-slate-100 dark:bg-slate-700 cursor-pointer",
                  category.name === selectedCategory &&
                    "bg-blue-400 dark:bg-blue-700"
                )}
                key={category.id}
              >
                {category.name}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* filter by Colors */}
      <div>
        <h3 className="text-lg font-medium my-2">By Colors</h3>
        <div className="flex items-center justify-start gap-2 flex-wrap">
          {COLOR_OPTIONS.map((colorOption) => (
            <p
              onClick={() => handleColorSelection(colorOption.name)}
              className={cn(
                "px-4 py-1 rounded-full bg-slate-100 dark:bg-slate-700  flex items-center justify-start gap-3 cursor-pointer",
                colorOption.name === selectedColor && "bg-blue-400 dark:bg-blue-700"
              )}
              key={colorOption.name}
            >
              <span
                className={`w-6 h-6 rounded-full border opacity-80`}
                style={{ backgroundColor: colorOption.hex }}
              />
              {colorOption.name}
            </p>
          ))}
        </div>
      </div>

      {/* filter by Brand name */}
      <div>
        <h3 className="text-lg font-medium my-2">By Brands</h3>
        {loading ? (
          <p className="text-sm text-gray-500">Loading brands...</p>
        ) : (
          <div className="flex items-center justify-start gap-2 flex-wrap">
            {brands.map((brand) => (
              <p
                onClick={() => handleBrandSelection(brand)}
                className={cn(
                  "px-4 py-1 rounded-full bg-slate-100 dark:bg-slate-700 cursor-pointer",
                  selectedBrand === brand && "bg-blue-400 dark:bg-blue-700"
                )}
                key={brand}
              >
                {brand}
              </p>
            ))}
          </div>
        )}
      </div>
      <div>
        <Button onClick={clearFilter} variant={"outline"} className="w-full">
          Clear Filter
        </Button>
      </div>
    </aside>
  );
};

export default FilterProducts;
