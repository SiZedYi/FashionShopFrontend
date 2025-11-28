"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { updateOrderStatusAdmin } from "@/service/order";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface OrderActionsProps {
  orderId: number;
  orderNumber: string;
}

const OrderActions = ({ orderId, orderNumber }: OrderActionsProps) => {
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    try {
      const updated = await updateOrderStatusAdmin(orderId, newStatus as any);
      toast.success(`Status updated to ${updated.status.toUpperCase()}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleCancelOrder = async () => {
    try {
      const updated = await updateOrderStatusAdmin(orderId, 'cancelled');
      toast.success(`Order ${orderNumber} cancelled`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel order");
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
            href={`/dashboard/orders/${orderId}`}
            className="py-2 px-4 rounded-md w-full block hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            View Details
          </Link>
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full text-base px-4 border-none outline-none focus:ring-offset-0 focus:ring-0 focus-within:outline-none hover:bg-slate-100 dark:hover:bg-slate-900">
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <button 
            onClick={handleCancelOrder}
            className="w-full text-start hover:bg-slate-100 dark:hover:bg-slate-900 py-2 px-4 rounded-md"
          >
            Cancel Order
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default OrderActions;
