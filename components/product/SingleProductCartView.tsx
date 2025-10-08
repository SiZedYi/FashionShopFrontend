"use client";
import React, { useEffect, useState } from "react";
import RatingReview from "../others/RatingReview";
import Link from "next/link";
import Image from "next/image";
import ProductOptions from "./ProductOptions";
import { calculateDiscount } from "@/lib/calculateDiscount";
import { useRouter } from "next/navigation";
import { Product } from "@/service/product";

const SingleProductCartView = ({ product }: { product: Product }) => {
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  const {
    category,
    discount,
    id,
    images,
    name,
    price,
    rating,
    stockItems,
  } = product;

  // Calculate discounted price
  const discountedPrice = calculateDiscount(price, discount || 0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Link
      href={`/shop/${id}`}
      className="relative border rounded-xl shadow-lg overflow-hidden group"
    >
      <div className={`w-full bg-gray-200 overflow-hidden`}>
        <div className="relative w-full h-[18rem] group-hover:scale-110 transition-all duration-300 rounded-md overflow-hidden">
          <Image
            className="object-cover"
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${images && images.length > 0 ? images[0] : "/placeholder.png"}`}
            alt={name}
            fill
          />
          {stockItems === 0 ? (
            <p className="py-1 px-4 text-sm font-bold rounded-sm bg-rose-500 text-white absolute top-2 right-2">
              out of stock
            </p>
          ) : (
            <p className="py-1 px-4 text-sm font-bold rounded-sm bg-rose-500 text-white absolute top-2 right-2">
              {product.discount}% off
            </p>
          )}
        </div>
      </div>
      <div className="hidden group-hover:block slideCartOptions absolute top-16 right-2">
        <ProductOptions product={product} />
      </div>
      <div className="my-2 space-y-1 p-4">
        <p
          onClick={(e) => {
            e.preventDefault();
            router.push(`shop?category=${category}`);
          }}
          className="text-sm text-sky-500 font-light -mb-1 hover:opacity-60 "
        >
          {" "}
          {category}
        </p>
        <h3 className="text-xl font-fold capitalize hover:text-green-500">
          {name.slice(0, 45)}
          {name.length > 45 && "..."}
        </h3>
        <RatingReview rating={rating ?? 0} />
        <div className="text-lg font-bold space-x-3 ">
          <span className="line-through text-muted-foreground">${price}</span>
          <span className="text-xl font-bold text-green-500">
            ${discountedPrice}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default SingleProductCartView;
