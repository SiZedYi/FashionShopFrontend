"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { searchProducts } from "@/service/search";
import { Product } from "@/types/product";

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);

    if (params.get("query")) {
      params.delete("query");
      params.set("query", searchTerm);
    } else {
      params.set("query", searchTerm);
    }

    router.push(`/search?${params}`);
    setOpen(false);
  };


  useEffect(() => {
    if(pathname !== '/search'){
      setSearchTerm('')
    }
  },[pathname])

  // Debounce fetch suggestions
  useEffect(() => {
    const handler = setTimeout(async () => {
      const term = searchTerm.trim();
      if (term.length < 2) {
        setSuggestions([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      const results = await searchProducts(term, 1, 10);
      setSuggestions(results);
      setOpen(true);
      setLoading(false);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Close when clicking outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full">
      <form
        onSubmit={onFormSubmit}
        className="flex items-start border-2 w/full rounded-lg bg-white dark:bg-gray-900"
      >
        <Input
          value={searchTerm}
          onFocus={() => suggestions.length && setOpen(true)}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded-md w-full lg:w-64 border-none outline-none focus:outline-none focus-visible:ring-offset-0 focus-visible:ring-0"
          placeholder="Search products..."
        />
        <Button
          type="submit"
          className="hover:opacity-30 duration-200"
          variant={"link"}
          aria-label="Search"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search size={25} />}
        </Button>
      </form>
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-80 overflow-auto rounded-md border bg-white dark:bg-gray-900 shadow">
          {loading && (
            <div className="p-3 text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Searching...
            </div>
          )}
          {!loading && suggestions.length === 0 && (
            <div className="p-3 text-sm text-muted-foreground">No results</div>
          )}
          {!loading && suggestions.map((p) => {
            const img = p.images && p.images[0] ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${p.images[0]}` : '';
            return (
              <button
                key={p.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { setOpen(false); router.push(`/shop/${p.id}`); }}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3"
              >
                {img ? (
                  <Image src={img} alt={p.name} width={36} height={36} className="rounded object-cover" />
                ) : (
                  <div className="h-9 w-9 rounded bg-gray-200 dark:bg-gray-700" />
                )}
                <div className="flex-1">
                  <div className="text-sm font-medium line-clamp-1">{p.name}</div>
                  {p.brand && <div className="text-xs text-muted-foreground line-clamp-1">{p.brand}</div>}
                </div>
              </button>
            );
          })}
          {!loading && suggestions.length > 0 && (
            <div className="border-t">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set('query', searchTerm);
                  router.push(`/search?${params}`);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                View all results for "{searchTerm}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
