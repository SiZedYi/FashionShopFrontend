"use client";
import { Minus, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import useCartStore from "@/store/cartStore";
import { showToast } from "@/lib/showToast";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";

const CartItemsDetails = () => {
  const [isMounted, setIsMounted] = useState(false);

  const { cartItems, removeFromCart, updateQuantity, clearCart } =
    useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (cartItems?.length === 0) {
    return (
      <div className="text-xl text-center p-2 lg:col-span-2">
        Sorry, No Item Found In The Cart
      </div>
    );
  }

  return (
    <div className="lg:col-span-2">
      <div className="hidden lg:grid grid-cols-6 gap-4 px-2 py-2 font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-300 dark:border-gray-500 text-base">
        <div className="text-center">Image</div>
        <div className="text-center">Color</div>
        <div className="text-left">Name</div>
        <div className="text-left">Price</div>
        <div className="text-center">Quantity</div>
        <div className="text-center">Action</div>
      </div>
      {cartItems?.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center border-b border-gray-300 dark:border-gray-500 py-4 px-2 text-sm lg:text-base"
        >
          {/* Image column */}
          <div className="flex justify-center">
            {(() => {
              let imgSrc = "";
              if (item.selectedColor && item.images && item.images.length > 0) {
                const productColors = item.color || [];
                let colorIdx = -1;
                if (Array.isArray(productColors)) {
                  colorIdx = productColors.findIndex(
                    (c) => c === item.selectedColor
                  );
                }
                // fallback: if colorIdx not found, use first image
                const imageValue = item.images[colorIdx >= 0 ? colorIdx : 0];
                imgSrc = imageValue
                  ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${imageValue}`
                  : "";
              } else if (item.images && item.images.length > 0) {
                imgSrc = item.images[0]
                  ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${item.images[0]}`
                  : "";
              }
              // Nếu không có ảnh, render placeholder
              if (!imgSrc) {
                return (
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600" />
                );
              }
              return (
                <Image
                  className="rounded object-contain"
                  src={imgSrc}
                  alt="product image"
                  width={50}
                  height={50}
                />
              );
            })()}
          </div>
          {/* Color column */}
          <div className="flex justify-center">
            {item.selectedColor ? (
              <span
                className="inline-block w-5 h-5 rounded-full border align-middle"
                style={{
                  backgroundColor: item.selectedColor,
                  borderColor: "#ccc",
                }}
                title={item.selectedColor}
              />
            ) : null}
          </div>
          {/* Name column */}
          <div className="flex items-center">
            <Link
              href={`/shop/${item.id}`}
              className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white hover:opacity-60"
            >
              {item?.name?.slice(0, 30)}
            </Link>
          </div>
          {/* Price column (left aligned) */}
          <div className="text-left">
            <p className="border rounded-md border-green-400 py-1 px-2 text-sm lg:text-base text-green-500 inline-block min-w-[60px] lg:min-w-[70px]">
              ${formatPrice(item?.price)}
            </p>
          </div>
          {/* Quantity column */}
          <div className="flex items-center justify-center gap-1 lg:gap-2">
            <Button
              onClick={() => {
                const newQty = (item?.quantity || 0) - 1;
                if (newQty <= 0) {
                  removeFromCart(item.id, item.selectedColor);
                  showToast(
                    "Item Removed from Cart",
                    item.name || ""
                  );
                } else {
                  updateQuantity(item?.id, newQty, item.selectedColor);
                }
              }}
              size={"md"}
              variant={"outline"}
            >
              <Minus />
            </Button>
            <p className="mx-1 lg:mx-2 w-8 lg:w-10 text-sm lg:text-base text-center">{item.quantity}</p>
            <Button
              onClick={() =>
                updateQuantity(item.id, item.quantity + 1, item.selectedColor)
              }
              size={"md"}
              variant={"outline"}
            >
              <Plus />
            </Button>
          </div>
          {/* Action column */}
          <div className="flex justify-center">
            <Button
              onClick={() => removeFromCart(item.id, item.selectedColor)}
              variant={"destructive"}
              size={"md"}
            >
              <X />
            </Button>
          </div>
        </div>
      ))}
      {cartItems?.length >= 1 && (
        <Button variant={"outline"} className="my-2" onClick={clearCart}>
          Clear Cart
        </Button>
      )}
    </div>
  );
};

export default CartItemsDetails;
