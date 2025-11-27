'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { updateCustomer } from '@/service/customer';
import { Customer } from '@/types/customer';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface UpdateCustomerFormProps {
  customer: Customer;
}

const UpdateCustomerForm = ({ customer }: UpdateCustomerFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: customer.fullName,
    phone: customer.phone || '',
    password: '',
    isActive: customer.isActive,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: any = {
        fullName: formData.fullName,
        phone: formData.phone,
        isActive: formData.isActive,
      };

      // Only include password if it's provided
      if (formData.password) {
        payload.password = formData.password;
      }

      console.log('Form Data:', formData);
      console.log('Payload to send:', payload);
      
      await updateCustomer(customer.id, payload);
      toast.success('Customer updated successfully');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update customer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">New Password (optional)</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
            className="w-full"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Only fill this if you want to change the customer's password
          </p>
        </div>

        <div className="space-y-2">
          <Label>Email (read-only)</Label>
          <Input
            type="email"
            value={customer.email}
            disabled
            className="w-full bg-gray-100 dark:bg-gray-700"
          />
        </div>

        <div className="flex items-center space-x-2 mt-6">
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => {
              setFormData({
                ...formData,
                isActive: checked === true,
              });
            }}
          />
          <Label
            htmlFor="isActive"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Active Status
          </Label>
        </div>

      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Customer'}
        </Button>
      </div>
    </form>
  );
};

export default UpdateCustomerForm;
