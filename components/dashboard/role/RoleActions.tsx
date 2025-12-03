"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { deleteRole } from "@/service/role";
import { toast } from "sonner";
import { usePermission } from "@/hooks/usePermission";

interface RoleActionsProps {
  roleId: number;
  roleName: string;
}

const RoleActions = ({ roleId, roleName }: RoleActionsProps) => {
  const router = useRouter();
  const { canAccess } = usePermission();

  const canEdit = canAccess('ROLES', 'WRITE');
  const canDelete = canAccess('ROLES', 'DELETE');

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete role "${roleName}"?`)) {
      return;
    }

    try {
      await deleteRole(roleId);
      toast.success("Role deleted successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete role");
    }
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger className="">
          <div className="flex items-center justify-center hover:bg-slate-100 p-2 rounded-full dark:hover:bg-slate-900 duration-200">
            <MoreHorizontal />
          </div>
        </PopoverTrigger>
        <PopoverContent className="text-start w-40">
          {(canEdit || canDelete) ? (
            <>
              {canEdit && (
                <Link
                  href={`/dashboard/roles/${roleId}`}
                  className="py-2 px-4 rounded-md w-full block hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  Edit
                </Link>
              )}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="w-full text-start hover:bg-slate-100 dark:hover:bg-slate-900 py-2 px-4 rounded-md text-red-600 dark:text-red-400"
                >
                  Delete
                </button>
              )}
            </>
          ) : (
            <div className="py-2 px-4 text-sm text-gray-500">No actions available</div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RoleActions;
