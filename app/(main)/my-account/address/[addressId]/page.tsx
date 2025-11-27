import AddressForm from '@/components/forms/AddressForm';
import { Separator } from '@/components/ui/separator';
import { getAddressById } from '@/service/customer';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import React from 'react';

type PageProps = {
  params: {
    addressId: string;
  };
};

const EditAddressPage = async ({ params }: PageProps) => {
  const addressId = parseInt(params.addressId);

  if (isNaN(addressId)) {
    notFound();
  }

  // Get token from server-side cookies
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;

  let address;
  try {
    address = await getAddressById(addressId, token);
  } catch (error) {
    notFound();
  }

  return (
    <div className='p-8 w-full md:w-2/4 bg-slate-100 dark:bg-slate-800 mx-auto m-2 rounded-md'>
      <h2 className='text-xl font-semibold mb-2'>Update Address</h2>
      <Separator className='bg-gray-500 mb-4'/>
      <AddressForm mode="edit" address={address} />
    </div>
  );
};

export default EditAddressPage;
