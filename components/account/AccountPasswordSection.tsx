'use client';

import React from 'react';
import ChangePasswordForm from './ChangePasswordForm';
import { changePassword } from '@/service/customer';

const AccountPasswordSection: React.FC = () => {
  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    await changePassword({
      currentPassword,
      newPassword
    });
  };

  return <ChangePasswordForm onPasswordChange={handlePasswordChange} />;
};

export default AccountPasswordSection;
