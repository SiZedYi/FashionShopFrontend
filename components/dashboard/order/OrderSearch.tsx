'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const OrderSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get('text') || '';
  const [text, setText] = useState<string>(initial);

  const triggerSearch = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (text) {
      params.set('text', text);
    } else {
      params.delete('text');
    }
    // reset to first page
    params.set('page', '1');
    router.push(`/dashboard/orders?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder='Search by number, status, city'
        className='w-full md:w-96 p-5 rounded-md'
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            triggerSearch();
          }
        }}
      />
      <Button onClick={triggerSearch} variant="outline">Search</Button>
    </div>
  )
}

export default OrderSearch