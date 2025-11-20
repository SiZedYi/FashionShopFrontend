"use client";
import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hydrate = useAuthStore((s) => s.hydrate);
  const syncUserFromServer = useAuthStore((s) => s.syncUserFromServer);
  useEffect(() => {
    hydrate();
    // After hydration, attempt to sync with server for fresh roles / status
    syncUserFromServer();
  }, [hydrate, syncUserFromServer]);
  return <>{children}</>;
};

export default AuthProvider;
