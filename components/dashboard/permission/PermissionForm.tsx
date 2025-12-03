"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPermission, updatePermission } from "@/service/permission";
import { toast } from "sonner";
import { Permission } from "@/types/permission";

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
});

type FormData = z.infer<typeof schema>;

interface PermissionFormProps {
  permission?: Permission;
  onSuccess?: () => void;
}

const PermissionForm: React.FC<PermissionFormProps> = ({ permission, onSuccess }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: permission || undefined,
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);

    try {
      if (permission) {
        await updatePermission(permission.id, data);
        toast.success("Permission updated successfully!");
      } else {
        await createPermission(data);
        toast.success("Permission created successfully!");
      }
      
      router.refresh();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save permission");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register("name")}
          className="w-full"
          placeholder="e.g., MANAGE_PRODUCTS"
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
          placeholder="e.g., Allows managing products"
        />
        {errors.description && (
          <span className="text-red-500 text-sm">{errors.description.message}</span>
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
          {isLoading ? "Saving..." : permission ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default PermissionForm;
