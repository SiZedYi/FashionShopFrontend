'use client'
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { usePermission } from "@/hooks/usePermission";

const ProductHeader = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const { canAccess } = usePermission();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (keyword) {
      params.set("keyword", keyword);
    } else {
      params.delete("keyword");
    }
    params.set("page", "1"); // Reset to first page on search
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Products
      </h2>
      <form className="flex items-center gap-4" onSubmit={handleSearch}>
        <Input
          placeholder="Search products by name"
          className="p-5 rounded-md w-full lg:w-96"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg whitespace-nowrap"
        >
          Search
        </button>
        {canAccess('PRODUCTS', 'WRITE') && (
          <Link
            href="/dashboard/products/add-product"
            className="px-4 py-2 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg whitespace-nowrap"
          >
            Add Product
          </Link>
        )}
      </form>
    </div>
  );
};

export default ProductHeader;
