'use client'
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getCategories, Category } from "@/service/category";

const CategorySection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await getCategories(1, 4);
      if (!mounted) return;
      if (res && Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        setCategories([]);
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", category);
    router.push(`shop?${params.toString()}`);
    window.scrollTo(0, 0);
  };

  return (
    <section className="py-16 bg-slate-300 dark:bg-slate-900">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-screen-xl mx-auto overflow-auto px-4 md:px-8">
        {loading && (
          [...Array(4)].map((_, idx) => (
            <div key={idx} className="p-4 rounded-lg shadow-md w-full h-[12rem] bg-gray-100/70 dark:bg-gray-800/70 animate-pulse" />
          ))
        )}
        {!loading && categories.map((category) => {
          const img = category.imageUrl ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${category.imageUrl}` : "/images/placeholder.png";
          return (
            <div
              onClick={() => handleCategoryClick(category.name)}
              key={category.id}
              className=" p-4 rounded-lg shadow-md w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 cursor-pointer"
            >
              <div className="relative w-[8rem] h-[8rem]">
                <Image className="object-cover object-center" src={img} fill alt={category.name} />
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold hover:underline">{category.name}</p>
                {category.description && <p className="text-sm text-muted-foreground">{category.description}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  );
};

export default CategorySection;
