import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";
import { getOrderByIdAdmin } from "@/service/order";
import { cookies } from "next/headers";
import { formatPrice } from "@/lib/formatPrice";
import UpdateOrderForm from "@/components/dashboard/order/UpdateOrderForm";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    orderId: string;
  };
};

const OrderDetails = async ({ params }: PageProps) => {
  const orderId = parseInt(params.orderId);

  if (isNaN(orderId)) {
    notFound();
  }

  // Get admin token from cookies
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;

  // Fetch order data
  const order = await getOrderByIdAdmin(orderId, token);

  if (!order) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "PROCESSING":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case "PAID":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "FAILED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="w-5/6 mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Order Details - {order.orderNumber}
      </h2>

      <Separator className="dark:bg-gray-500 my-4" />

      {/* Order Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Order Information
          </h3>
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Order Number:</span> {order.orderNumber}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Customer ID:</span> #{order.customerId}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Customer Name:</span>{" "}
              {order.shippingAddress
                ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                : "N/A"}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Order Date:</span>{" "}
              {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Payment Method:</span> {order.paymentMethod}
            </p>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
              <span
                className={`inline-flex text-xs font-semibold rounded-full px-2 py-1 ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Payment Status:</span>
              <span
                className={`inline-flex text-xs font-semibold rounded-full px-2 py-1 ${getPaymentStatusColor(
                  order.paymentStatus
                )}`}
              >
                {order.paymentStatus.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Shipping Information
          </h3>
          {order.shippingAddress ? (
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Name:</span>{" "}
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Address:</span> {order.shippingAddress.address}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">City:</span> {order.shippingAddress.city}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">ZIP:</span> {order.shippingAddress.zip}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Country:</span> {order.shippingAddress.country}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No shipping address available</p>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Order Items
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-500 rounded-md">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Color
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Unit Price
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Quantity
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {order.items.map((item) => (
                <tr key={item.id} className="bg-white dark:bg-gray-800">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {item.productImage && (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.productImage}`}
                          alt={item.productName || "Product"}
                          width={50}
                          height={50}
                          className="rounded object-cover"
                        />
                      )}
                      <span className="text-gray-900 dark:text-white font-medium">
                        {item.productName || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                    {item.productSku || "-"}
                  </td>
                  <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                    {item.color || "-"}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-900 dark:text-white font-medium">
                    {formatPrice(item.unitPrice || 0)}
                  </td>
                  <td className="px-4 py-4 text-center text-gray-700 dark:text-gray-300">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-900 dark:text-white font-semibold">
                    {formatPrice(item.lineTotal || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Summary */}
      <div className="flex justify-end mb-6">
        <div className="w-full md:w-1/2 lg:w-1/3 space-y-2">
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <span>Subtotal:</span>
            <span className="font-medium">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <span>Tax:</span>
            <span className="font-medium">{formatPrice(order.tax)}</span>
          </div>
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <span>Shipping Fee:</span>
            <span className="font-medium">{formatPrice(order.shippingFee)}</span>
          </div>
          {order.couponCode && (
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>Coupon ({order.couponCode}):</span>
              <span className="font-medium">Applied</span>
            </div>
          )}
          <Separator className="dark:bg-gray-500" />
          <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
            <span>Total:</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      <Separator className="dark:bg-gray-500 my-6" />

      {/* Update Order Form */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Update Order
        </h3>
        <UpdateOrderForm order={order} />
      </div>
    </div>
  );
};

export default OrderDetails;
