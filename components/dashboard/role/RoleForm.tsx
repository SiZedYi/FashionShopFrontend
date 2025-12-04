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
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  console.log('Initial role:', role);

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
      permissionIds: [],
    },
  });

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await getAllPermissions();
        setPermissions(data);
        
        // Map role permission names to permission IDs after fetching permissions
        if (role && role.permissions && Array.isArray(role.permissions)) {
          // Check if permissions are strings (permission names) or objects
          const rolePermissions = role.permissions;
          
          if (rolePermissions.length > 0 && typeof rolePermissions[0] === 'string') {
            // Permissions are strings (names), map to IDs
            const permissionIds = data
              .filter(p => (rolePermissions as string[]).includes(p.name))
              .map(p => p.id);
            
            console.log('Mapped permission IDs from names:', permissionIds);
            setSelectedPermissions(permissionIds);
            setValue("permissionIds", permissionIds, { shouldValidate: true });
          } else {
            // Permissions are objects, extract IDs
            const permissionIds = (rolePermissions as Permission[])
              .map(p => p.id)
              .filter((id): id is number => typeof id === 'number');
            
            console.log('Extracted permission IDs from objects:', permissionIds);
            setSelectedPermissions(permissionIds);
            setValue("permissionIds", permissionIds, { shouldValidate: true });
          }
        } else {
          // No role or no permissions, reset to empty
          setSelectedPermissions([]);
          setValue("permissionIds", []);
        }
      } catch (error) {
        toast.error("Failed to load permissions");
      }
    };
    fetchPermissions();
  }, [role, setValue]);

  const handlePermissionToggle = (permissionId: number) => {
    const newSelected = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter(id => id !== permissionId)
      : [...selectedPermissions, permissionId];
    
    setSelectedPermissions(newSelected);
    setValue("permissionIds", newSelected, { shouldValidate: true });
    console.log('Selected permissions:', newSelected);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);

    try {
      console.log('Submitting role data:', data);
      console.log('Role ID:', role?.id);
      
      if (role) {
        const result = await updateRole(role.id, data);
        console.log('Update result:', result);
        toast.success("Role updated successfully!");
        
        // Redirect to roles list after update to see fresh data
        router.push("/dashboard/roles");
        router.refresh();
      } else {
        const result = await createRole(data);
        console.log('Create result:', result);
        toast.success("Role created successfully!");
        router.push("/dashboard/roles");
        router.refresh();
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Submit error:', error);
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
