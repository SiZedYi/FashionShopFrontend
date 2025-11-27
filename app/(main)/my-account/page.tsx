
import Link from 'next/link';
import React from 'react';
import { getUserProfile } from '@/service/customer';
import { Button } from '@/components/ui/button';
import { cookies } from 'next/headers';
import ProfileForm from '@/components/account/ProfileForm';
import AccountPasswordSection from '@/components/account/AccountPasswordSection';

const MyAccountPage = async () => {
  let profileData = null;
  let error: string | null = null;

  // Get token from server-side cookies
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;

  try {
    profileData = await getUserProfile(token);
  } catch (err: any) {
    error = err.message;
  }

  if (error || !profileData) {
    return (
      <div className="px-4 py-8 lg:px-16 lg:py-12 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-8">
            My Account
          </h1>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
            <p className="text-red-500">Failed to load profile: {error || 'Unknown error'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 lg:px-16 lg:py-12 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-8">
          My Account
        </h1>
        <ProfileForm initialData={profileData} />
        <div className="mt-8">
          <AccountPasswordSection />
        </div>
        <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <div className='flex items-center justify-between mb-4'>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Addresses</h2>
            <Link href={'/my-account/address/new'}>
              <Button>Add New Address</Button>
            </Link>
          </div>
          
          {profileData.addresses.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No addresses found</p>
          ) : (
            <div className="space-y-4">
              {profileData.addresses.map((address: any) => (
                <div key={address.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {address.fullName}
                      {address.isDefault && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </h3>
                    <Link href={`/my-account/address/${address.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{address.phone}</p>
                  <p className="text-gray-700 dark:text-gray-300">{address.line1}</p>
                  {address.line2 && <p className="text-gray-700 dark:text-gray-300">{address.line2}</p>}
                  <p className="text-gray-700 dark:text-gray-300">
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">{address.country}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
