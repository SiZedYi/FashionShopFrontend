'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface CategoryFormProps {
  action: 'add' | 'update';
  category?: {
    id: number;
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
    images?: string;
  };
  token: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ action, category, token }) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (action === 'update' && category) {
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description || "");
      setIsActive(category.isActive);
    }
  }, [action, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      
      const dataObj = {
        name: name,
        slug: slug,
        description: description,
        isActive: isActive
      };
      
      const dataBlob = new Blob([JSON.stringify(dataObj)], { type: 'application/json' });
      formData.append("data", JSON.stringify(dataObj));
      
      if (image) {
        formData.append("image", image);
      }
      
      const url = action === 'add'
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/categories`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${category?.id}`;
      
      const method = action === 'add' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Operation failed");
      }

      setSuccess(`Category ${action === 'add' ? 'added' : 'updated'} successfully!`);
      router.push('/dashboard/categories');
    } catch (err: any) {
      setError(err.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-4/5 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {action === 'add' ? 'Add New Category' : 'Update Category'}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: category details */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-white">
              Category Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <Label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-white">
              Slug
            </Label>
            <Input
              id="slug"
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-white">
              Description
            </Label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="mt-1 p-2 block border bg-white dark:bg-slate-950 rounded-md w-full border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="isActive" className="block text-sm font-medium text-gray-700 dark:text-white">
              Status
            </Label>
            <select
              id="isActive"
              value={isActive ? "true" : "false"}
              onChange={e => setIsActive(e.target.value === "true")}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-950 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}

          <div>
            <Button type="submit" disabled={loading}>
              {loading ? (action === 'add' ? 'Adding...' : 'Updating...') : (action === 'add' ? 'Add Category' : 'Update Category')}
            </Button>
          </div>
        </div>

        {/* Right column: image upload */}
        <div className="space-y-4">
          <div className="border rounded-md p-4 dark:border-gray-700">
            <Label className="block text-sm font-medium text-gray-700 dark:text-white">
              Category Image
            </Label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {action === 'add' ? 'Upload an image for the category.' : 'Upload a new image to replace the current one (optional).'}
            </p>

            <div className="mt-3">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={e => setImage(e.target.files?.[0] || null)}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              />
              {image && (
                <p className="text-xs mt-1 text-green-600">{image.name} selected</p>
              )}
            </div>

            {action === 'update' && category?.images && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Current Image:</p>
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${category.images}`}
                  alt={category.name}
                  width={200}
                  height={200}
                  className="rounded-md object-cover border dark:border-gray-600"
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;

