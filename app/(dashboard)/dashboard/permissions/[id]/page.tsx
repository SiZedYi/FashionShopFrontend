import PermissionForm from "@/components/dashboard/permission/PermissionForm";
import { getPermissionById } from "@/service/permission";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";

type PageProps = {
  params: {
    id: string;
  };
};

const EditPermissionPage = async ({ params }: PageProps) => {
  const permissionId = parseInt(params.id);

  if (isNaN(permissionId)) {
    notFound();
  }

  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;

  const permission = await getPermissionById(permissionId, token);

  if (!permission) {
    notFound();
  }

  return (
    <div className="w-5/6 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Edit Permission
      </h2>
      <PermissionForm permission={permission} />
    </div>
  );
};

export default EditPermissionPage;
