import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

const CategoryActions = ({ categoryId }: { categoryId: number }) => {
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
            href={`/categories/${categoryId}`}
            target="_blank"
            rel="noopener noreferrer"
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
          <button className="w-full text-start hover:bg-slate-100 dark:hover:bg-slate-900 py-2 px-4 rounded-md">
            Delete Category
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CategoryActions;
