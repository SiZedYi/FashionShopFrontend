import React from "react";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getUserById } from "@/service/user";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { MANAGE_USERS, READ_USERS, WRITE_USERS } from "@/const/permissions";
import UserForm from "@/components/dashboard/user/UserForm";
import { Separator } from "@/components/ui/separator";

type PageProps = {
  params: {
    userId: string;
  };
};

const UserDetailPage = async ({ params }: PageProps) => {
  const userId = parseInt(params.userId);

  if (isNaN(userId)) {
    notFound();
  }

  // Get admin token from cookies
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    redirect("/dashboard/login");
  }

  // Fetch user data
  const user = await getUserById(userId, token);

  if (!user) {
    notFound();
  }

  return (
    <div className="max-w-4xl w-full p-4 my-4 mx-auto dark:bg-slate-900 rounded-md">
        {/* User Information Display */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              User Details
            </h2>
            <a
              href="/dashboard/users"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Users
            </a>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</h3>
                <p className="mt-1 text-gray-900 dark:text-white">#{user.id}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                <p className="mt-1 text-gray-900 dark:text-white">{user.email}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
                <p className="mt-1 text-gray-900 dark:text-white">{user.fullName}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h3>
                <p className="mt-1 text-gray-900 dark:text-white">{user.phone || "N/A"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                <p className="mt-1">
                  <span
                    className={`inline-flex text-xs font-semibold rounded-full px-2 py-1 ${
                      user.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</h3>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {new Date(user.createdAt).toLocaleString()}
                </p>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Roles</h3>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role, index) => (
                    <span
                      key={index}
                      className="inline-flex text-xs font-semibold rounded-full px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6 dark:bg-gray-700" />

        {/* Edit User Form - Only show if user has write permissions */}
        <PermissionGuard permissions={[MANAGE_USERS, WRITE_USERS]}>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Edit User
            </h2>
            <UserForm user={user} mode="edit" />
          </div>
        </PermissionGuard>
      </div>
  );
};

export default UserDetailPage;
