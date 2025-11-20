"use client";
import React, { Suspense, useEffect, useState } from "react";
import ProductViewChange from "../product/ProductViewChange";
import Pagination from "../others/Pagination";
import SingleProductListView from "@/components/product/SingleProductListView";
import { Product } from "@/types/product";
import SingleProductCartView from "../product/SingleProductCartView";
import { Loader2 } from "lucide-react";
import Loader from "../others/Loader";
import { getAllProduct } from "@/service/product";

interface FilterState {
  category: string;
  brand: string;
  color: string;
  minPrice: number;
  maxPrice: number;
}

interface ShopPageContainerProps {
  filters: FilterState;
  gridColumn?: number;
}

const ShopPageContainer = ({
  filters,
  gridColumn,
}: ShopPageContainerProps) => {
  const [loading, setLoading] = useState(true);
  const [listView, setListView] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Fetch products from API with filters whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const apiFilters = {
          page: currentPage,
          size: itemsPerPage,
          category: filters.category || undefined,
          brand: filters.brand || undefined,
          color: filters.color || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
        };

        const response = await getAllProduct(apiFilters);
        
        if (response) {
          setProducts(response.data);
          setTotalPages(response.totalPages);
          setCurrentPage(response.page);
        } else {
          setProducts([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full flex-col gap-3">
        <Loader2 className="animate-spin text-xl" size={50} />
        <p>Loading products..</p>
      </div>
    );
  }

  if (products.length === 0 && !loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center flex-col gap-4 text-xl mx-auto font-semibold space-y-4">
        <ProductViewChange
          listView={listView}
          setListView={setListView}
          totalPages={totalPages}
          itemPerPage={itemsPerPage}
          currentPage={currentPage}
        />
        <p>Sorry no result found with your filter selection</p>
      </div>
    );
  }

  return (
    <div className="md:ml-4 p-2 md:p-0">
      {/* product status and filter options */}
      <ProductViewChange
        listView={listView}
        setListView={setListView}
        totalPages={totalPages}
        itemPerPage={itemsPerPage}
        currentPage={currentPage}
      />

      {/* showing product list or cart view based on state */}
      {listView === true && (
        <div className="max-w-screen-xl mx-auto overflow-hidden py-4 md:py-8 gap-4 lg:gap-6">
          {products.map((product: Product) => (
            <SingleProductListView key={product.id} product={product} />
          ))}
        </div>
      )}

      {listView === false && (
        <div
          className={`max-w-screen-xl mx-auto overflow-hidden py-4 md:py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${
            gridColumn || 3
          } overflow-hidden  gap-4 lg:gap-6`}
        >
          {products.map((product: Product) => (
            <SingleProductCartView key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* product pagination here */}
      <Suspense fallback={<Loader />}>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </Suspense>
    </div>
  );
};

export default ShopPageContainer;
