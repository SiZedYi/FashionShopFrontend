import PermissionActions from "@/components/dashboard/permission/PermissionActions";
import Loader from "@/components/others/Loader";
import Pagination from "@/components/others/Pagination";
import { getPermissions } from "@/service/permission";
import React, { Suspense } from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Permission } from "@/types/permission";
import { canAccessResource } from "@/lib/auth";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const PermissionsPage = async ({ searchParams }: PageProps) => {
  const pageParam = typeof searchParams?.page === "string" ? searchParams?.page : Array.isArray(searchParams?.page) ? searchParams?.page?.[0] : undefined;
  const sizeParam = typeof searchParams?.size === "string" ? searchParams?.size : Array.isArray(searchParams?.size) ? searchParams?.size?.[0] : undefined;

  const page = Number(pageParam) > 0 ? Number(pageParam) : 1;
  const size = Number(sizeParam) > 0 ? Number(sizeParam) : 10;

  // Get admin token from cookies
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;

  const permissionsData = await getPermissions({ page, size, token });
  
  const permissions = permissionsData?.data || [];
  const totalPages = permissionsData?.totalPages || 1;
  const currentPage = permissionsData?.page || page;
  const totalElements = permissionsData?.totalElements || 0;
  const canManage = token ? canAccessResource(token, 'PERMISSIONS', 'WRITE') : false;

  return (
    <div className="w-5/6 mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Permissions
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Total: {totalElements} permissions
          </p>
        </div>
        {canManage && (
          <Link href="/dashboard/permissions/new">
            <Button>Add Permission</Button>
          </Link>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full w-full divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-500 rounded-md">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {permissions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No permissions found
                </td>
              </tr>
            ) : (
              permissions.map((permission: Permission) => (
                <tr key={permission.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {permission.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {permission.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {permission.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PermissionActions permissionId={permission.id} permissionName={permission.name} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Suspense fallback={<Loader />}>
          <Pagination currentPage={currentPage} pageName="page" totalPages={totalPages} />
        </Suspense>
      </div>
    </div>
  );
};

export default PermissionsPage;
