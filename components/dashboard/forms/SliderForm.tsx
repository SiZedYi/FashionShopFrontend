'use client'
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Slider } from '@/types/slider';
import { createSlider, updateSlider } from '@/service/slider';
import { useRouter } from 'next/navigation';
import { showToast } from '@/lib/showToast';

const sliderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  imageUrl: z.string().min(1, "Image URL is required"),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

type SliderFormValues = z.infer<typeof sliderSchema>;

interface SliderFormProps {
  slider?: Slider;
}

const SliderForm: React.FC<SliderFormProps> = ({ slider }) => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<SliderFormValues>({
    resolver: zodResolver(sliderSchema),
    defaultValues: slider || {
      title: '',
      subtitle: '',
      imageUrl: '',
      buttonText: '',
      buttonLink: '',
      textAlign: 'center',
      isActive: true,
      displayOrder: 0,
    },
  });

  const onSubmit: SubmitHandler<SliderFormValues> = async (data) => {
    try {
      if (slider) {
        await updateSlider(slider.id, data);
        showToast('success', 'Slider updated successfully');
      } else {
        await createSlider(data);
        showToast('success', 'Slider created successfully');
      }
      router.push('/dashboard/sliders');
    } catch (error) {
      showToast('error', 'Failed to save slider');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{slider ? 'Edit Slider' : 'Add Slider'}</h2>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
        <input type="text" id="title" {...register('title')} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subtitle</label>
        <input type="text" id="subtitle" {...register('subtitle')} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
        <input type="text" id="imageUrl" {...register('imageUrl')} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</p>}
      </div>

      <div>
        <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Button Text</label>
        <input type="text" id="buttonText" {...register('buttonText')} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>

      <div>
        <label htmlFor="buttonLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Button Link</label>
        <input type="text" id="buttonLink" {...register('buttonLink')} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>

      <div>
        <label htmlFor="textAlign" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Text Align</label>
        <select id="textAlign" {...register('textAlign')} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      <div>
        <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Order</label>
        <input type="number" id="displayOrder" {...register('displayOrder', { valueAsNumber: true })} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>

      <div className="flex items-center">
        <input id="isActive" type="checkbox" {...register('isActive')} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Is Active</label>
      </div>

      <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
        {slider ? 'Update Slider' : 'Add Slider'}
      </button>
    </form>
  );
};

export default SliderForm;
