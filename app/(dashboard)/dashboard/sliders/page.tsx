import { Slider } from '@/types/slider';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { getSliders } from '@/service/slider';
import { cookies } from 'next/headers';
import SliderActions from '@/components/dashboard/slider/SliderActions';

const SliderPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token')?.value || cookieStore.get('auth_token')?.value;
  const sliders: Slider[] = await getSliders(token) ?? [];

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen w-full my-4 rounded-md">
      <div className="max-w-screen-xl w-full mx-auto px-4 py-6">
        <div className='flex items-center justify-between mb-6'>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white ">Manage Sliders</h1>
        <div className="flex justify-end">
          <Link href={'/dashboard/sliders/add-slider'} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg">Add Slider</Link>
        </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sliders.map((slider) => (
            <div key={slider.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md">
              <div className='relative w-full h-[16rem]'>
              <Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${slider.imageUrl}`} fill alt={slider.title || 'slider image'} className="w-full h-64 object-cover" />
              </div>
              <div className="p-6">
               <div className='flex items-center justify-between gap-2'>
               <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{slider.title}</h2>
               <SliderActions sliderId={slider.id} />
               </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{slider.subtitle}</p>
                <a href={`${slider.buttonLink}`} className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">{slider.buttonText}</a>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default SliderPage;
