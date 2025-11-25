
"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ProductActions = ({ productId }: { productId: number }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.message || "Delete failed");
      }
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setOpen(false);
      setError(err.message || "Delete failed");
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
            href={`/shop/${productId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-4 rounded-md w-full  block hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            View Product
          </Link>
          <Link
            href={`/dashboard/products/${productId}`}
            className="py-2 px-4 rounded-md w-full  block hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Update Product
          </Link>
          <button
            className="w-full text-start hover:bg-slate-100 dark:hover:bg-slate-900 py-2 px-4 rounded-md"
            onClick={() => setOpen(true)}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Product"}
          </button>
        </PopoverContent>
      </Popover>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
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

export default ProductActions;
