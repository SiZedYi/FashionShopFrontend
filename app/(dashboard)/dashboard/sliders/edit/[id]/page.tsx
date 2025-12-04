'use client'
import SliderForm from '@/components/dashboard/forms/SliderForm';
import BreadcrumbComponent from '@/components/others/Breadcrumb';
import { getSliderById } from '@/service/slider';
import { Slider } from '@/types/slider';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const EditSliderPage = () => {
  const { id } = useParams();
  const [slider, setSlider] = useState<Slider | null>(null);

  useEffect(() => {
    if (id) {
      const fetchSlider = async () => {
        const data = await getSliderById(Number(id));
        setSlider(data);
      };
      fetchSlider();
    }
  }, [id]);

  if (!slider) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-2 w-full'>
      <BreadcrumbComponent links={['/dashboard', '/sliders']} pageText='edit slider' />
      <SliderForm slider={slider} />
    </div>
  );
};

export default EditSliderPage;
