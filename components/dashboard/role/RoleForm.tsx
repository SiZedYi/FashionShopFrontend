"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createRole, updateRole } from "@/service/role";
import { getAllPermissions } from "@/service/permission";
import { toast } from "sonner";
import { Role } from "@/types/role";
import { Permission } from "@/types/permission";

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  permissionIds: z.array(z.number()).min(1, "Select at least one permission"),
});

type FormData = z.infer<typeof schema>;

interface RoleFormProps {
  role?: Role;
  onSuccess?: () => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ role, onSuccess }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
    role?.permissions?.map(p => p.id) || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: role?.name || "",
      description: role?.description || "",
      permissionIds: role?.permissions?.map(p => p.id) || [],
    },
  });

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await getAllPermissions();
        setPermissions(data);
      } catch (error) {
        toast.error("Failed to load permissions");
      }
    };
    fetchPermissions();
  }, []);

  const handlePermissionToggle = (permissionId: number) => {
    const newSelected = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter(id => id !== permissionId)
      : [...selectedPermissions, permissionId];
    
    setSelectedPermissions(newSelected);
    setValue("permissionIds", newSelected);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);

    try {
      if (role) {
        await updateRole(role.id, data);
        toast.success("Role updated successfully!");
      } else {
        await createRole(data);
        toast.success("Role created successfully!");
      }
      
      router.refresh();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/roles");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register("name")}
          className="w-full"
          placeholder="e.g., Admin"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          {...register("description")}
          className="w-full"
          placeholder="e.g., Administrator role with full access"
        />
        {errors.description && (
          <span className="text-red-500 text-sm">{errors.description.message}</span>
        )}
      </div>

      <div>
        <Label className="mb-3 block">Permissions</Label>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-h-80 overflow-y-auto space-y-3">
          {permissions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Loading permissions...</p>
          ) : (
            permissions.map((permission) => (
              <div key={permission.id} className="flex items-start space-x-3">
                <Checkbox
                  id={`permission-${permission.id}`}
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={() => handlePermissionToggle(permission.id)}
                />
                <div className="flex-1">
                  <label
                    htmlFor={`permission-${permission.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {permission.name}
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {permission.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        {errors.permissionIds && (
          <span className="text-red-500 text-sm">{errors.permissionIds.message}</span>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : role ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default RoleForm;
