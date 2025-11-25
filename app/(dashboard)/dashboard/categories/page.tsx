import type { Category } from "@/service/category";
import CategoryActions from "@/components/dashboard/category/CategoryActions";
import Loader from "@/components/others/Loader";
import Pagination from "@/components/others/Pagination";
import PageSizeSelector from "@/components/others/PageSizeSelector";
import { getAllCategoriesAdmin } from "@/service/category";
import Image from "next/image";
import React, { Suspense } from "react";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

import { cookies } from "next/headers";

const CategoryPage = async ({ searchParams }: PageProps) => {
  const pageParam = typeof searchParams?.page === "string" ? searchParams?.page : Array.isArray(searchParams?.page) ? searchParams?.page?.[0] : undefined;
  const sizeParam = typeof searchParams?.size === "string" ? searchParams?.size : Array.isArray(searchParams?.size) ? searchParams?.size?.[0] : undefined;

  const page = Number(pageParam) > 0 ? Number(pageParam) : 1;
  const size = Number(sizeParam) > 0 ? Number(sizeParam) : 8;

  // Lấy token admin từ cookies
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;

  const categories = await getAllCategoriesAdmin({ page, size, token });
  const categoriesData = categories?.data || [];
  const totalPages = categories?.totalPages || 1;
  const currentPage = categories?.page || page;

  return (
    <div className="w-5/6 mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Browse Categories</h1>
        <PageSizeSelector />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full overflow-x-scroll divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-500">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 dark:border-gray-700 first:border-l-0">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 dark:border-gray-700 first:border-l-0">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 dark:border-gray-700 first:border-l-0">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 dark:border-gray-700 first:border-l-0">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 dark:border-gray-700 first:border-l-0">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 dark:border-gray-700 first:border-l-0">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {(categoriesData as Category[]).map((category: Category) => (
              <tr key={category.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-900">
                <td className="px-6 py-4 whitespace-nowrap first:border-l-0 border-l border-gray-200 dark:border-gray-700">
                  {category.images ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${category.images}`}
                      alt={category.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-normal break-words first:border-l-0 border-l border-gray-200 dark:border-gray-700">{category.name}</td>
                <td className="px-6 py-4 whitespace-normal break-words first:border-l-0 border-l border-gray-200 dark:border-gray-700">
                  <div className="max-w-xs truncate" title={category.description}>{category.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap first:border-l-0 border-l border-gray-200 dark:border-gray-700">{category.slug}</td>
                <td className="px-6 py-4 whitespace-nowrap first:border-l-0 border-l border-gray-200 dark:border-gray-700">{category.isActive ? "Active" : "Inactive"}</td>
                <td className="px-6 py-4 whitespace-nowrap first:border-l-0 border-l border-gray-200 dark:border-gray-700">{category.createdAt ? new Date(category.createdAt).toLocaleDateString() : "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap first:border-l-0 border-l border-gray-200 dark:border-gray-700">
                  <CategoryActions categoryId={category.id} />
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

export default CategoryPage;
