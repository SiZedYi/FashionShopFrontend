'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateUserProfile } from '@/service/customer';
import { toast } from 'sonner';
import { UserProfile } from '@/types/customer';

interface ProfileFormProps {
  initialData: UserProfile;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData }) => {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName,
    phone: initialData.phone,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        isActive: true
      };

      await updateUserProfile(payload);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={initialData.email}
              readOnly
              disabled
              className="w-full bg-gray-100 dark:bg-gray-800"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Status</label>
            <p className="text-gray-800 dark:text-white flex items-center h-10">
              {initialData.isActive ? (
                <span className="text-green-600 dark:text-green-400">Active</span>
              ) : (
                <span className="text-red-600 dark:text-red-400">Inactive</span>
              )}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Member Since</label>
            <p className="text-gray-800 dark:text-white flex items-center h-10">
              {new Date(initialData.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
