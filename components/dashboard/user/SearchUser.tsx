'use client';
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react'

const SearchUser = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('email') || '');
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchTerm.trim()) {
      params.set('email', searchTerm.trim());
      params.set('page', '1'); // Reset to page 1 when searching
    } else {
      params.delete('email');
    }
    
    startTransition(() => {
      router.push(`/dashboard/users?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <Input 
        placeholder='Search user by email' 
        className='rounded-md p-5 w-full lg:w-96 pr-10'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button 
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        disabled={isPending}
      >
        <Search size={20} />
      </button>
    </form>
  )
}

export default SearchUser
