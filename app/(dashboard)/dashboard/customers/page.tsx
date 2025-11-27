import SearchCustomer from "@/components/dashboard/customer/SearchCustomer";
import CustomerActions from "@/components/dashboard/customer/CustomerActions";
import Loader from "@/components/others/Loader";
import Pagination from "@/components/others/Pagination";
import { getCustomers } from "@/service/customer";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

type PageProps = {
  searchParams: {
    page?: string;
    name?: string;
  };
};

const CustomersPage = async ({ searchParams }: PageProps) => {
  const page = parseInt(searchParams.page || '1');
  const name = searchParams.name || '';

  // Get admin token from cookies
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;

  // Fetch customers data
  const customersData = await getCustomers({
    page,
    size: 10,
    name: name || undefined,
    token
  });

  const customers = customersData?.data || [];
  const totalPages = customersData?.totalPages || 1;

  return (
    <div className="max-w-screen-xl w-full p-4 my-4 mx-auto dark:bg-slate-900 rounded-md">
      <div className="flex items-center justify-between gap-2 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white ">
          Customers
        </h2>
        <SearchCustomer />
      </div>
      
      {customers.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No customers found
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y dark:text-slate-100 divide-gray-200 dark:divide-gray-700 border">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Full Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Addresses
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Created At
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {customer.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {customer.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {customer.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex text-xs font-semibold rounded-full px-2 py-1 ${
                          customer.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {customer.addresses.length > 0 ? (
                        <div className="max-w-xs">
                          {customer.addresses[0].line1}, {customer.addresses[0].city}
                          {customer.addresses.length > 1 && (
                            <span className="text-gray-500 dark:text-gray-400">
                              {' '}(+{customer.addresses.length - 1} more)
                            </span>
                          )}
                        </div>
                      ) : (
                        'No address'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <CustomerActions 
                        customerId={customer.id} 
                        customerName={customer.fullName} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Suspense fallback={<Loader />}>
            <Pagination totalPages={totalPages} currentPage={page} pageName="customers" />
          </Suspense>
        </>
      )}
    </div>
  );
};

export default CustomersPage;
