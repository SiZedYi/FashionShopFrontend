'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const CreateUserButton = () => {
  return (
    <Link href="/dashboard/users/new">
      <Button className="flex items-center gap-2">
        <Plus size={20} />
        Create User
      </Button>
    </Link>
  );
};

export default CreateUserButton;
