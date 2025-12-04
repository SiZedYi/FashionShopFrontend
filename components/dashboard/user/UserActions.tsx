'use client';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface UserActionsProps {
  userId: number;
  userName: string;
}

const UserActions = ({ userId, userName }: UserActionsProps) => {
  return (
    <Link href={`/dashboard/users/${userId}`}>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        title={`View ${userName}`}
      >
        <Eye size={16} />
        View
      </Button>
    </Link>
  );
};

export default UserActions;
