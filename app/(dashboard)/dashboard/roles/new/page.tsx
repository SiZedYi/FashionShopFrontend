import RoleForm from "@/components/dashboard/role/RoleForm";
import React from "react";

const NewRolePage = () => {
  return (
    <div className="w-5/6 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Create New Role
      </h2>
      <RoleForm />
    </div>
  );
};

export default NewRolePage;
