import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = () => {
  return (
    <Link href={'/'} className='flex items-center gap-2 mr-3 md:mr-0'>
        <p className='text-2xl font-bold'>Leon&apos;s FashionShop</p>
    </Link>
  )
}

export default Logo