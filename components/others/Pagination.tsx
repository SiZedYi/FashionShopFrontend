"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  pageName?: string;
}

const Pagination = ({ totalPages, currentPage, pageName = "page" }: PaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams(searchParams);
    params.set(pageName, String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  const buttons = [];
  for (let i = 1; i <= totalPages; i++) {
    buttons.push(
      <button
        key={i}
        className={`px-3 py-2 mr-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          currentPage === i ? "bg-indigo-500 text-white font-bold" : ""
        }`}
        onClick={() => handleChange(i)}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="flex justify-center my-8">
      <button
        className="px-3 py-2 mr-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 cursor-default"
        onClick={() => handleChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {buttons}
      <button
        className="px-3 py-2 mr-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 cursor-default"
        onClick={() => handleChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
