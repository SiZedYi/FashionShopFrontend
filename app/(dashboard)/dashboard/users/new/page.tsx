import React from "react";
import UserForm from "@/components/dashboard/user/UserForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const NewUserPage = () => {
  // Get admin token from cookies
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    redirect("/dashboard/login");
  }

  return (
    <div className="max-w-4xl w-full p-4 my-4 mx-auto dark:bg-slate-900 rounded-md">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Create New User
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Add a new admin user to the system
        </p>
      </div>

      <UserForm mode="create" />
    </div>
  );
};

export default NewUserPage;
