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
import { deletePermission } from "@/service/permission";
import { toast } from "sonner";
import { usePermission } from "@/hooks/usePermission";

interface PermissionActionsProps {
  permissionId: number;
  permissionName: string;
}

const PermissionActions = ({ permissionId, permissionName }: PermissionActionsProps) => {
  const router = useRouter();
  const { canAccess } = usePermission();

  const canEdit = canAccess('PERMISSIONS', 'WRITE');
  const canDelete = canAccess('PERMISSIONS', 'DELETE');

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete permission "${permissionName}"?`)) {
      return;
    }

    try {
      await deletePermission(permissionId);
      toast.success("Permission deleted successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete permission");
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
                  href={`/dashboard/permissions/${permissionId}`}
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

export default PermissionActions;
