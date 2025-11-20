import ProductActions from "@/components/dashboard/product/ProductActions";
import ProductHeader from "@/components/dashboard/product/ProductHeader";
import Loader from "@/components/others/Loader";
import Pagination from "@/components/others/Pagination";
import PageSizeSelector from "@/components/others/PageSizeSelector";
import { getAllProduct } from "@/service/product";
import Image from "next/image";
import { formatPrice } from "@/lib/formatPrice";
import React, { Suspense } from "react";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const ProductsPage = async ({ searchParams }: PageProps) => {
  const pageParam = typeof searchParams?.page === "string" ? searchParams?.page : Array.isArray(searchParams?.page) ? searchParams?.page?.[0] : undefined;
  const sizeParam = typeof searchParams?.size === "string" ? searchParams?.size : Array.isArray(searchParams?.size) ? searchParams?.size?.[0] : undefined;

  const page = Number(pageParam) > 0 ? Number(pageParam) : 1;
  const size = Number(sizeParam) > 0 ? Number(sizeParam) : 8;

  const products = await getAllProduct({ page, size });
  const productsData = products?.data || [];
  const totalPages = products?.totalPages || 1;
  const currentPage = products?.page || page;
  return (
    <div className="w-5/6 mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        <ProductHeader />
        <PageSizeSelector />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full overflow-x-scroll divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-500">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 dark:border-gray-700 first:border-l-0">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 dark:border-gray-700 first:border-l-0">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 dark:border-gray-700 first:border-l-0">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 dark:border-gray-700 first:border-l-0">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 dark:border-gray-700 first:border-l-0">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 dark:border-gray-700 first:border-l-0">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 dark:border-gray-700 first:border-l-0">
                Categories
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 dark:border-gray-700 first:border-l-0">
                Colors
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 dark:border-gray-700 first:border-l-0">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 dark:border-gray-700 first:border-l-0">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {productsData.map((product) => (
              <tr
                key={product.id}
                className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-900"
              >
                <td className="px-6 py-4 whitespace-nowrap first:border-l-0 border-l border-gray-200 dark:border-gray-700">
                  {product.images?.[0] ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${product.images[0]}`}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-normal break-words first:border-l-0 border-l border-gray-200 dark:border-gray-700">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap first:border-l-0 border-l border-gray-200 dark:border-gray-700">{formatPrice(product.price)}</td>
                <td className="px-6 py-4 whitespace-nowrap first:border-l-0 border-l border-gray-200 dark:border-gray-700">
                  {product.discount ?? "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap first:border-l-0 border-l border-gray-200 dark:border-gray-700">
                  {product.rating ?? "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap first:border-l-0 border-l border-gray-200 dark:border-gray-700">
                  {product.stockItems}
                </td>
                <td className="px-6 py-4 whitespace-nowrap first:border-l-0 border-l border-gray-200 dark:border-gray-700">
                  {product.brand ?? "-"}
                </td>
                <td className="px-6 py-4 whitespace-normal break-words first:border-l-0 border-l border-gray-200 dark:border-gray-700">
                  {product.categories?.length ? product.categories.join(", ") : "-"}
                </td>
                <td className="px-6 py-4 whitespace-normal break-words first:border-l-0 border-l border-gray-200 dark:border-gray-700">
                  {product.color?.length ? product.color.join(", ") : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap align-top first:border-l-0 border-l border-gray-200 dark:border-gray-700">
                  <div className="max-w-xs truncate" title={product.description}>
                    {product.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap first:border-l-0 border-l border-gray-200 dark:border-gray-700">
                  <ProductActions productId={product.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Suspense fallback={<Loader />}>
          <Pagination totalPages={totalPages} currentPage={currentPage} pageName="page" />
        </Suspense>
      </div>
    </div>
  );
};

export default ProductsPage;
