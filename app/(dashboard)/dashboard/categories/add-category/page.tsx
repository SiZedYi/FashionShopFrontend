import CategoryForm from '@/components/dashboard/forms/CategoryForm'
import BreadcrumbComponent from '@/components/others/Breadcrumb'
import React from 'react'

const AddCategoryPage = () => {
  return (
    <div className='p-2 w-full'>
      <BreadcrumbComponent links={['/dashboard','/categories']} pageText='add category'/>
      <CategoryForm action="add" token={""} />
    </div>
  )
}

export default AddCategoryPage