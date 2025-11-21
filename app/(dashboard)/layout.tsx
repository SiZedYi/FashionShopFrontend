"use client";

import DashboardHeader from "@/components/dashboard/header/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/sidebar/DashboardSidebar";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { Toaster } from "sonner";
import { useAdminAuthStore } from "@/store/adminAuthStore";

const layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { hydrate } = useAdminAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Hydrate admin user from localStorage
    hydrate();

    // Skip auth check for login page
    if (pathname === "/login") {
      setIsChecking(false);
      return;
    }

    // Check if admin is authenticated
    const adminToken = Cookies.get("admin_token");
    
    if (!adminToken) {
      router.push("/login");
    } else {
      setIsChecking(false);
    }
  }, [pathname, router, hydrate]);

  // If on login page, render without header/sidebar
  if (pathname === "/login") {
    return (
      <>
        <Toaster position="top-center" richColors />
        {children}
      </>
    );
  }

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-center" richColors />
      <DashboardHeader />
      <div className="mx-auto  flex flex-col md:flex-row">
        <DashboardSidebar />
        {children}
      </div>
    </div>
  );
};

export default layout;
