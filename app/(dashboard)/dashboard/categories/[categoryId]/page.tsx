import CategoryForm from "@/components/dashboard/forms/CategoryForm";
import { getAllCategoriesAdmin } from '@/service/category';
import { cookies } from 'next/headers';
import React from 'react';

interface PageProps {
  params: { categoryId: string };
}

const UpdateCategoryPage = async ({ params }: PageProps) => {
  const token = cookies().get('admin_token')?.value || '';
  const categoryId = Number(params.categoryId);
  // Fetch category detail from API (reuse admin API, get single category if available)
  // For demo, fetch all and filter
  const categoriesRes = await getAllCategoriesAdmin({ page: 1, size: 100, token });
  const category = categoriesRes?.data?.find((cat: any) => cat.id === categoryId);
  if (!category) {
    return <div className="p-4">Category not found.</div>;
  }
  return (
    <div className="w-full">
      <CategoryForm action="update" category={category} token={token} />
    </div>
  );
};

export default UpdateCategoryPage;
