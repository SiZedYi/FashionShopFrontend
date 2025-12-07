'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { createUser } from '@/service/user';
import { getAllRoles } from '@/service/role';
import { toast } from 'sonner';

const schema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  isActive: z.boolean().default(true),
  roles: z.array(z.string()).min(1, 'At least one role is required'),
});

type FormData = z.infer<typeof schema>;

interface CreateUserFormProps {
  onSuccess?: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phone: '',
      isActive: true,
      roles: [],
    },
  });

  const isActive = watch('isActive');
  const selectedRoles = watch('roles');

  // Fetch available roles on mount
  React.useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoadingRoles(true);
        const roles = await getAllRoles();
        const roleNames = roles.map((role: any) => role.name);
        setAvailableRoles(roleNames);
      } catch (error) {
        console.error('Failed to fetch roles:', error);
        toast.error('Failed to load roles');
      } finally {
        setIsLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  const handleRoleToggle = (role: string) => {
    const newRoles = selectedRoles.includes(role)
      ? selectedRoles.filter((r) => r !== role)
      : [...selectedRoles, role];
    setValue('roles', newRoles, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);

    try {
      const payload = {
        ...data,
        phone: data.phone || '',
      };
      await createUser(payload);
      toast.success('User created successfully!');
      router.refresh();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            {...register('fullName')}
            placeholder="John Doe"
            className="w-full"
          />
          {errors.fullName && (
            <span className="text-red-500 text-sm">{errors.fullName.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="john@example.com"
            className="w-full"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            placeholder="••••••••"
            className="w-full"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            placeholder="+1234567890"
            className="w-full"
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone.message}</span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={isActive}
          onCheckedChange={(checked) => setValue('isActive', checked === true)}
        />
        <Label
          htmlFor="isActive"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Active Status
        </Label>
      </div>

      <div className="space-y-2">
        <Label>Assign Roles *</Label>
        {isLoadingRoles ? (
          <p className="text-sm text-gray-500">Loading roles...</p>
        ) : availableRoles.length === 0 ? (
          <p className="text-sm text-gray-500">No roles available</p>
        ) : (
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto">
            {availableRoles.map((role) => (
              <div key={role} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role}`}
                  checked={selectedRoles.includes(role)}
                  onCheckedChange={() => handleRoleToggle(role)}
                />
                <Label
                  htmlFor={`role-${role}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {role}
                </Label>
              </div>
            ))}
          </div>
        )}
        {errors.roles && (
          <span className="text-red-500 text-sm">{errors.roles.message}</span>
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
          {isLoading ? 'Creating...' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default CreateUserForm;
