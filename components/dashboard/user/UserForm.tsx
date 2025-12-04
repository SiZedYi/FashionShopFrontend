"use client";

import React, { useState, useEffect } from "react";
import { AdminUser, CreateUserPayload, UpdateUserPayload, UpdateUserRolesPayload } from "@/service/user";
import { createUser, updateUser, updateUserRoles } from "@/service/user";
import { getAllRoles } from "@/service/role";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserFormProps {
  user?: AdminUser | null;
  mode: "create" | "edit";
}

const UserForm = ({ user, mode }: UserFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    email: user?.email || "",
    password: "",
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    isActive: user?.isActive ?? true,
  });

  const [selectedRoles, setSelectedRoles] = useState<string[]>(user?.roles || []);

  // Fetch available roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoadingRoles(true);
        const roles = await getAllRoles();
        const roleNames = roles.map((role) => role.name);
        setAvailableRoles(roleNames);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        toast.error("Failed to load roles");
      } finally {
        setIsLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoleToggle = (roleName: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        // Validate required fields for create
        if (!formData.email || !formData.password || !formData.fullName) {
          toast.error("Please fill in all required fields");
          setIsSubmitting(false);
          return;
        }

        if (selectedRoles.length === 0) {
          toast.error("Please select at least one role");
          setIsSubmitting(false);
          return;
        }

        // Create new user
        const payload: CreateUserPayload = {
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: formData.phone,
          isActive: formData.isActive,
          roles: selectedRoles,
        };

        const result = await createUser(payload);

        if (result) {
          toast.success("User created successfully!");
          router.push("/dashboard/users");
          router.refresh();
        }
      } else {
        // Update existing user
        if (!user) {
          toast.error("User not found");
          setIsSubmitting(false);
          return;
        }

        // Update user basic info
        const updatePayload: UpdateUserPayload = {
          fullName: formData.fullName,
          phone: formData.phone,
          isActive: formData.isActive,
        };

        // Include password only if it's provided
        if (formData.password) {
          updatePayload.password = formData.password;
        }

        const result = await updateUser(user.id, updatePayload);

        // Update roles if changed
        const rolesChanged =
          JSON.stringify(selectedRoles.sort()) !== JSON.stringify(user.roles.sort());

        if (rolesChanged) {
          const rolesPayload: UpdateUserRolesPayload = {
            roles: selectedRoles,
          };
          await updateUserRoles(user.id, rolesPayload);
        }

        if (result) {
          toast.success("User updated successfully!");
          router.refresh();
        }
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${mode} user`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={mode === "edit" ? "md:col-span-2" : ""}>
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={mode === "edit"}
              required
              placeholder="user@example.com"
            />
            {mode === "edit" && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Email cannot be changed
              </p>
            )}
          </div>

          <div className={mode === "create" ? "md:col-span-2" : "md:col-span-2"}>
            <Label htmlFor="password">
              Password {mode === "create" && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required={mode === "create"}
              placeholder={mode === "edit" ? "Leave blank to keep current password" : "Enter password"}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="fullName">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+1234567890"
            />
          </div>

          <div className="md:col-span-2 flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                handleInputChange("isActive", checked === true)
              }
            />
            <Label
              htmlFor="isActive"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Active
            </Label>
          </div>
        </div>
      </div>

      {/* Roles Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Roles <span className="text-red-500">*</span>
        </h3>
        {isLoadingRoles ? (
          <p className="text-gray-500 dark:text-gray-400">Loading roles...</p>
        ) : availableRoles.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No roles available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableRoles.map((role) => (
              <div key={role} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role}`}
                  checked={selectedRoles.includes(role)}
                  onCheckedChange={() => handleRoleToggle(role)}
                />
                <Label
                  htmlFor={`role-${role}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {role}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoadingRoles}>
          {isSubmitting
            ? mode === "create"
              ? "Creating..."
              : "Updating..."
            : mode === "create"
            ? "Create User"
            : "Update User"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
