"use client";
import { ShoppingBag, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Separator } from "../ui/separator";
import Image from "next/image";
import ViewCart from "../buttons/ViewCart";
import CheckoutBtn from "../buttons/CheckoutBtn";
import { Button } from "../ui/button";
import useCartStore from "@/store/cartStore";
import { showToast } from "@/lib/showToast";
import { formatPrice } from "@/lib/formatPrice";
import { CartItem } from "@/types/cart";

const Cart = () => {
  const { cartItems, getTotalItems, removeFromCart, getTotalPrice, updateQuantity } =
    useCartStore();
  const [showSheet, setShowSheet] = useState(false);
  const [isMounted, setIsMounted] = useState(false);


  const handleRovomeItemFromCart = (item: CartItem) => {
    removeFromCart(item.id, item.selectedColor);
    showToast("Item Removed from Cart", (item?.images && item.images[0]) || "", item.name);
  };


  const handleIncrement = (item: CartItem) => {
    const newQty = item.quantity + 1;
    updateQuantity(item.id, newQty, item.selectedColor);
  };


  const handleDecrement = (item: CartItem) => {
    const newQty = item.quantity - 1;
    if (newQty <= 0) {
      // remove item when quantity goes to 0
      removeFromCart(item.id, item.selectedColor);
      showToast("Item Removed from Cart", (item?.images && item.images[0]) || "", item.name);
    } else {
      updateQuantity(item.id, newQty, item.selectedColor);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="relative p-2 hover:bg-gray-200 dark:hover:bg-gray-800 duration-200 rounded-md">
        <ShoppingBag size={25} />
        <Badge className="absolute -top-2 -right-3" variant="destructive">
          0
        </Badge>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <Sheet open={showSheet} onOpenChange={() => setShowSheet(!showSheet)}>
        <SheetTrigger>
          <div className="relative p-2 hover:bg-gray-200 dark:hover:bg-gray-800 duration-200 rounded-md mt-2">
            <ShoppingBag size={25} />
            <Badge className="absolute -top-0 -right-2" variant="destructive">
              {getTotalItems()}
            </Badge>
          </div>
        </SheetTrigger>
        <SheetContent className="w-[90%] overflow-y-auto md:overflow-y-hidden">
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
            <Separator />
            <SheetDescription className="flex items-start justify-between gap-4 flex-col h-[90vh]">
              <div className="overflow-y-auto">
                {/* cart items here */}
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className=" flex items-center justify-center gap-4 p-2
                       border-b-2 border-t-gray-500"
                  >
                    {(() => {
                      let imgSrc = '';
                      if (item.selectedColor && item.images && item.images.length > 0) {
                        // Try to find the index of the selected color
                        const productColors = item.color || [];
                        let colorIdx = -1;
                        if (Array.isArray(productColors)) {
                          colorIdx = productColors.findIndex(c => c === item.selectedColor);
                        }
                        // fallback: if colorIdx not found, use first image
                        imgSrc = `${process.env.NEXT_PUBLIC_IMAGE_URL}${item.images[colorIdx >= 0 ? colorIdx : 0]}`;
                      } else if (item.images && item.images.length > 0) {
                        imgSrc = `${process.env.NEXT_PUBLIC_IMAGE_URL}${item.images[0]}`;
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
                    {/* Color swatch */}
                    {item.selectedColor && (
                      <span
                        className="inline-block w-5 h-5 rounded-full border ml-2 align-middle"
                        style={{ backgroundColor: item.selectedColor, borderColor: '#ccc' }}
                        title={item.selectedColor}
                      />
                    )}
                    <div className="space-y-2">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                        <h2 className="text-lg font-bold">{item.name.slice(0, 100)}</h2>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-lg border border-green-500 px-2 rounded-md text-green-500">
                          ${item.price}
                        </p>
                        <div className="w-40 inline-flex items-center justify-center gap-2">
                          <Button
                            size="md"
                            onClick={() => handleDecrement(item)}
                            variant="outline"
                          >
                            -
                          </Button>
                          <p className="mx-2 w-30 text-lg">{item.quantity}</p>
                          <Button
                            size="md"
                            onClick={() => handleIncrement(item)}
                            variant="outline"
                          >
                            +
                          </Button>
                        </div>

                        <Button
                          onClick={() => handleRovomeItemFromCart(item)}
                          variant={"destructive"}
                          size={"sm"}
                          className="rounded-full"
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* subtotal and buttons here */}
              <div className="w-full">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl text-center font-semibold">
                    Your Subtotal :
                  </h3>
                  <p className="text-xl text-center font-bold text-green-500">
                    $ {formatPrice(getTotalPrice())}
                  </p>
                </div>

                <Separator className="!my-2" />
                <div
                  className="flex flex-col items-center !my-2"
                  onClick={() => setShowSheet(false)}
                >
                  <ViewCart />
                  <CheckoutBtn />
                </div>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};
export default Cart;
