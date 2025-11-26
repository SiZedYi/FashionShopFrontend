"use client";

import React, { useState } from "react";
import { Order, UpdateOrderPayload } from "@/types/order";
import { updateOrderAdmin } from "@/service/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UpdateOrderFormProps {
  order: Order;
}

const UpdateOrderForm = ({ order }: UpdateOrderFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    firstName: order.shippingAddress?.firstName || "",
    lastName: order.shippingAddress?.lastName || "",
    address: order.shippingAddress?.address || "",
    phone: order.shippingAddress?.phone || "",
    city: order.shippingAddress?.city || "",
    zip: order.shippingAddress?.zip || "",
    country: order.shippingAddress?.country || "",
  });

  // Items state
  const [items, setItems] = useState(
    order.items.map((item) => ({
      itemId: item.id || 0,
      quantity: item.quantity,
      productName: item.productName || "",
      unitPrice: item.unitPrice || 0,
    }))
  );

  const handleShippingChange = (field: string, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemQuantityChange = (index: number, quantity: number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare payload
      const payload: UpdateOrderPayload = {
        shippingAddress,
        items: items.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
        })),
      };

      const result = await updateOrderAdmin(order.id, payload);

      if (result) {
        toast.success("Order updated successfully!");
        router.refresh(); // Refresh the page to show updated data
      } else {
        toast.error("Failed to update order");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping Address Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Shipping Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={shippingAddress.firstName}
              onChange={(e) => handleShippingChange("firstName", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={shippingAddress.lastName}
              onChange={(e) => handleShippingChange("lastName", e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={shippingAddress.address}
              onChange={(e) => handleShippingChange("address", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={shippingAddress.phone}
              onChange={(e) => handleShippingChange("phone", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={shippingAddress.city}
              onChange={(e) => handleShippingChange("city", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              value={shippingAddress.zip}
              onChange={(e) => handleShippingChange("zip", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={shippingAddress.country}
              onChange={(e) => handleShippingChange("country", e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Order Items Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Order Items
        </h3>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.itemId}
              className="flex items-center gap-4 p-4 border dark:border-gray-600 rounded-md"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.productName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Unit Price: ${item.unitPrice?.toFixed(2) || "0.00"}
                </p>
              </div>
              <div className="w-32">
                <Label htmlFor={`quantity-${item.itemId}`}>Quantity</Label>
                <Input
                  id={`quantity-${item.itemId}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemQuantityChange(index, parseInt(e.target.value) || 1)
                  }
                  required
                />
              </div>
              <div className="w-32 text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  ${((item.unitPrice || 0) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Order"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateOrderForm;
