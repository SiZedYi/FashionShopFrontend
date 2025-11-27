'use client';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface CustomerActionsProps {
  customerId: number;
  customerName: string;
}

const CustomerActions = ({ customerId, customerName }: CustomerActionsProps) => {
  return (
    <Link href={`/dashboard/customers/${customerId}`}>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        title={`View ${customerName}`}
      >
        <Eye size={16} />
        View
      </Button>
    </Link>
  );
};

export default CustomerActions;
