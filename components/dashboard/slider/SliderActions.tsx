'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { deleteSlider } from '@/service/slider';
import { showToast } from '@/lib/showToast';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface SliderActionsProps {
  sliderId: number;
}

const SliderActions: React.FC<SliderActionsProps> = ({ sliderId }) => {
  const router = useRouter();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this slider?')) {
      try {
        await deleteSlider(sliderId);
        showToast('success', 'Slider deleted successfully');
        router.refresh();
      } catch (error) {
        showToast('error', 'Failed to delete slider');
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link href={`/dashboard/sliders/edit/${sliderId}`} className="text-blue-500 hover:text-blue-700">
        <Edit size={20} />
      </Link>
      <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default SliderActions;
