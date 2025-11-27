import { Separator } from "@/components/ui/separator";
import { getCustomerById } from "@/service/customer";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import UpdateCustomerForm from "@/components/dashboard/customer/UpdateCustomerForm";

type PageProps = {
  params: {
    customerId: string;
  };
};

const CustomerDetailPage = async ({ params }: PageProps) => {
  const customerId = parseInt(params.customerId);

  if (isNaN(customerId)) {
    notFound();
  }

  // Get admin token from cookies
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;

  // Fetch customer data
  const customer = await getCustomerById(customerId, token);

  if (!customer) {
    notFound();
  }

  return (
    <div className="w-5/6 mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Customer Details - {customer.fullName}
        </h2>
        <Link href="/dashboard/customers">
            <ArrowLeft size={16} className="mr-2" />
        </Link>
      </div>

      <Separator className="dark:bg-gray-500 my-4" />

      {/* Customer Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Basic Information
          </h3>
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Customer ID:</span> #{customer.id}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Full Name:</span> {customer.fullName}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Email:</span> {customer.email}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Phone:</span> {customer.phone || "N/A"}
            </p>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
              <span
                className={`inline-flex text-xs font-semibold rounded-full px-2 py-1 ${
                  customer.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}
              >
                {customer.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Roles:</span>{" "}
              {customer.roles.length > 0 ? customer.roles.join(", ") : "No roles assigned"}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Created At:</span>{" "}
              {customer.createdAt ? new Date(customer.createdAt).toLocaleString() : "-"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Addresses
          </h3>
          {customer.addresses.length > 0 ? (
            <div className="space-y-4">
              {customer.addresses.map((address, index) => (
                <div
                  key={address.id}
                  className="p-4 border border-gray-200 dark:border-gray-600 rounded-md space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Address {index + 1}
                    </h4>
                    {address.isDefault && (
                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Full Name:</span> {address.fullName}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Phone:</span> {address.phone}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Address Line 1:</span> {address.line1}
                  </p>
                  {address.line2 && (
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Address Line 2:</span> {address.line2}
                    </p>
                  )}
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">City:</span> {address.city}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">State:</span> {address.state}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Postal Code:</span> {address.postalCode}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Country:</span> {address.country}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-xs">
                    <span className="font-medium">Created:</span>{" "}
                    {new Date(address.createdAt).toLocaleString()}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-xs">
                    <span className="font-medium">Updated:</span>{" "}
                    {new Date(address.updatedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No addresses available</p>
          )}
        </div>
      </div>

      <Separator className="dark:bg-gray-500 my-6" />

      {/* Update Customer Form */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Update Customer Information
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Update customer information below. Email cannot be changed.
        </p>
        <UpdateCustomerForm customer={customer} />
      </div>
    </div>
  );
};

export default CustomerDetailPage;
