import RoleForm from "@/components/dashboard/role/RoleForm";
import { getRoleById } from "@/service/role";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";

type PageProps = {
  params: {
    id: string;
  };
};

const EditRolePage = async ({ params }: PageProps) => {
  const roleId = parseInt(params.id);

  if (isNaN(roleId)) {
    notFound();
  }

  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;

  const role = await getRoleById(roleId, token);

  if (!role) {
    notFound();
  }

  return (
    <div className="w-5/6 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Edit Role
      </h2>
      <RoleForm role={role} />
    </div>
  );
};

export default EditRolePage;
