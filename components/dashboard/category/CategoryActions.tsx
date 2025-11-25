"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const CategoryActions = ({ categoryId, categoryName }: { categoryId: number; categoryName: string }) => {
  const encodedName = encodeURIComponent(categoryName);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Get token from cookie
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return "";
      };
      const token = getCookie("admin_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      setOpen(false);
      window.location.reload();
    } catch (err: any) {
      setOpen(false);
      toast.error(err.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger className="">
          <div className="flex items-center justify-center hover:bg-slate-100 p-2 rounded-full dark:hover:bg-slate-900 duration-200">
            <MoreHorizontal />
          </div>
        </PopoverTrigger>
        <PopoverContent className="text-start">
          <Link
            href={`/shop?category=${encodedName}`}
            className="py-2 px-4 rounded-md w-full block hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            View Category
          </Link>
          <Link
            href={`/dashboard/categories/${categoryId}`}
            className="py-2 px-4 rounded-md w-full block hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Update Category
          </Link>
          <button
            className="w-full text-start hover:bg-slate-100 dark:hover:bg-slate-900 py-2 px-4 rounded-md text-red-600"
            onClick={() => setOpen(true)}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Category"}
          </button>
        </PopoverContent>
      </Popover>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded mr-2"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryActions;
