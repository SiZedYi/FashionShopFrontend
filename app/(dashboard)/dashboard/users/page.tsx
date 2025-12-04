import SearchUser from "@/components/dashboard/user/SearchUser";
import UserActions from "@/components/dashboard/user/UserActions";
import CreateUserButton from "@/components/dashboard/user/CreateUserButton";
import Loader from "@/components/others/Loader";
import Pagination from "@/components/others/Pagination";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { getUsers } from "@/service/user";
import { MANAGE_USERS, READ_USERS, WRITE_USERS } from "@/const/permissions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

type PageProps = {
  searchParams: {
    page?: string;
    email?: string;
  };
};

const UsersPage = async ({ searchParams }: PageProps) => {
  const page = parseInt(searchParams.page || '1');
  const email = searchParams.email || '';

  // Get admin token from cookies
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    redirect("/dashboard/login");
  }

  // Fetch users data
  const usersData = await getUsers({
    page,
    size: 20,
    email: email || undefined,
    token
  });

  const users = usersData?.data || [];
  const totalPages = usersData?.totalPages || 1;

  return (
    <div className="max-w-screen-xl w-full p-4 my-4 mx-auto dark:bg-slate-900 rounded-md">
        <div className="flex items-center justify-between gap-2 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white ">
            Admin Users
          </h2>
          <div className="flex items-center gap-2">
            <SearchUser />
            <PermissionGuard permissions={[MANAGE_USERS, WRITE_USERS]}>
              <CreateUserButton />
            </PermissionGuard>
          </div>
        </div>
        
        {users.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No users found
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
                      Roles
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
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {user.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role, index) => (
                            <span
                              key={index}
                              className="inline-flex text-xs font-semibold rounded-full px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex text-xs font-semibold rounded-full px-2 py-1 ${
                            user.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <UserActions 
                          userId={user.id} 
                          userName={user.fullName} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Suspense fallback={<Loader />}>
              <Pagination totalPages={totalPages} currentPage={page} pageName="users" />
            </Suspense>
          </>
        )}
      </div>
  );
};

export default UsersPage;
