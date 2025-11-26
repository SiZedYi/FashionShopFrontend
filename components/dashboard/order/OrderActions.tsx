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

interface OrderActionsProps {
  orderId: number;
  orderNumber: string;
}

const OrderActions = ({ orderId, orderNumber }: OrderActionsProps) => {
  const handleStatusChange = (newStatus: string) => {
    // TODO: Implement status change functionality
    console.log(`Changing order ${orderNumber} status to:`, newStatus);
  };

  const handleCancelOrder = () => {
    // TODO: Implement cancel order functionality
    console.log(`Canceling order ${orderNumber}`);
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
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
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
