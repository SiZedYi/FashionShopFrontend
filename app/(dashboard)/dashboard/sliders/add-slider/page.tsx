import SliderForm from '@/components/dashboard/forms/SliderForm';
import BreadcrumbComponent from '@/components/others/Breadcrumb'
import React from 'react'

const AddSliderPage = () => {
  return (
    <div className='p-2 w-full'>
      <BreadcrumbComponent links={['/dashboard','/sliders']} pageText='add slider'/>
      <SliderForm />
    </div>
  )
}

export default AddSliderPage;