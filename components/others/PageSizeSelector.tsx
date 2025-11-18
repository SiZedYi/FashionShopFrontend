"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

type Props = {
  paramName?: string; // query param name for page size
  options?: number[]; // allowed page sizes
  label?: string;
};

const PageSizeSelector: React.FC<Props> = ({
  paramName = "size",
  options = [5, 8, 10, 20, 50],
  label = "Items per page",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSizeStr = searchParams.get(paramName);
  const currentSize = currentSizeStr ? parseInt(currentSizeStr, 10) : undefined;

  const onChange = (size: number) => {
    const params = new URLSearchParams(searchParams);
    params.set(paramName, String(size));
    // Reset page to 1 to avoid out-of-range page when changing size
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-300">{label}:</span>
      <div className="inline-flex rounded-md shadow-sm overflow-hidden border border-gray-200 dark:border-gray-600">
        {options.map((opt) => {
          const active = (currentSize ?? options[1]) === opt; // default pick second option if unset
          return (
            <button
              key={opt}
              type="button"
              className={`px-3 py-1.5 text-sm transition-colors focus:outline-none ${
                active
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => onChange(opt)}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PageSizeSelector;
